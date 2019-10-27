
	let dmn_inp=document.getElementById("dmn");
	let chk_st=document.getElementById("st_bl");
	let opt0 =document.getElementById("opt0");
	let opt1 =document.getElementById("opt1");
	let opt2 =document.getElementById("opt2");
	let metaThemeColor = document.querySelector("meta[name=theme-color]");
	let dataStorage = new InjectedDataStorage(new DataStorage());
	let currentInjectionData;
	let hue=0,sat=0,light=0;let defaultColor;
	const hueInput = document.getElementById("hue");
	const satInput = document.getElementById("sat");
	const lightInput = document.getElementById("light");
	const swatch = document.querySelector('.swatch');
	const hexInput = document.getElementById("hex_in");
	let lrtStatus = 0;
	const hslToHex = (h, s, l) => {
		h /= 360,s /= 100,l /= 100;
		let r, g, b;
		if (s === 0) { r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}
		const toHex = x => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
	const hexToHsl = (hex) =>{
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var r = parseInt(result[1], 16);
		var g = parseInt(result[2], 16);
		var b = parseInt(result[3], 16);
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if(max == min){h = s = 0; 
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		s = s*100;
		sat = Math.round(s);
		l = l*100;
		light = Math.round(l);
		hue = Math.round(360*h);
	}
	const hslToColor = () => {
		swatch.style.backgroundColor = getHSL();
		let hexValue=getHEX();
		swatch.value = hexInput.value = satInput.style.backgroundColor = hexValue;
		metaThemeColor.setAttribute("content", hexValue);
	}
	const hexToColor= () =>{
		hueInput.value=hue;
		satInput.value=sat;
		lightInput.value=light;
		swatch.style.backgroundColor = getHSL();
		satInput.style.backgroundColor = getHEX();
	}
	const getHEX = () => {return hslToHex(hue, sat, light);};
	const getHSL = () => {return `hsl(${hue}, ${sat}%, ${light}%)`;};
	const evList = () =>
	{
		dmn_inp.addEventListener("input", ()=> {saveEditorContent();});
		hueInput.addEventListener('input',()=> {hue = hueInput.value;hslToColor();});
		satInput.addEventListener('input',()=> {sat = satInput.value;hslToColor();});
		lightInput.addEventListener('input',()=> {light = lightInput.value;hslToColor();});
		hexInput.addEventListener('input',()=>{
			hexV=hexInput.value;
			if(hexV.length==7){
				hexToHsl(hexV);
				hexToColor();
			}
		});	
		hslToColor();
		document.querySelector("#res_btn").addEventListener("click", ()=>{dmn_inp.value = InjectedDataStorage.getCurrentDomain();})
		document.querySelector("#save_btn").addEventListener("click",()=>{saveEditorContent();})
		document.querySelector("#def_btn").addEventListener("click",()=>{ show_lrt(0);});
		document.querySelector("#exp_btn").addEventListener("click",()=>{exportData()});
		document.querySelector("#res2_btn").addEventListener("click",()=>{show_lrt(1);});
		document.querySelector("#imp_btn").addEventListener("click",()=>{document.querySelector("#imp_f").click() });
		document.querySelector("#imp_f").addEventListener("change", ()=>{importData()}, false);
		opt0.addEventListener("change",()=>{ 
			let ch=opt0.checked;
			opt1.checked =opt2.checked =ch;
			opt1.disabled=(ch)?false:true;
			opt2.disabled=(ch)?false:true;
		})
		document.getElementById("can_lrt").onclick = ()=>{document.getElementById("mylrt").style.display ="none";}
		// When the user clicks on the button, open the lrt
		document.getElementById("ok_lrt").onclick = ()=> {
			switch (lrtStatus) {
				case 0:
						defaultColor=document.getElementById("def_inp").value;
						hexInput.value=defaultColor;
						hexToHsl(defaultColor);
						hexToColor();
					break;
				case 1:
						chrome.storage.local.clear();location.reload();
					break;
				default:
					break;
			}
			document.getElementById("mylrt").style.display ="none";
		}
	}
	let messages=["Reset color to default one on current website<br> You can edit below and change default color ,then click ok to confirm change<input id='def_inp' type='text' maxlength='7'/>",
	"Are you sure you want to reset ? ( you will lose all extension data like colors per hosts)",
	]
	const show_lrt = (l) =>{
		lrtStatus=l;
		document.getElementById("lrt_body").innerHTML= messages[l];
		if(l==0)document.getElementById("def_inp").value=defaultColor;
		document.getElementById("mylrt").style.display ="block";
	}
	
	const exportData = () => {
		chrome.storage.local.get(null, function(items) { 
			var result = JSON.stringify(items);
			var url = 'data:application/json;base64,' + btoa(result);
			var date = new Date();
			var le = document.createElement('a');
			le.setAttribute('href', url);
			le.setAttribute('download', 'mti_'+(date.getUTCMonth() + 1) + '' + date.getUTCDate() + '_' +
			date.getHours() + '-' + date.getMinutes() + '.json');
			le.click();
		});
	}
	const importData = () =>{
		chrome.storage.local.clear();
		var file = document.querySelector("#imp_f").files[0];
		var reader = new FileReader();
		reader.onload = function (progressEvent) {
			var test = this.result;
			var test2 = JSON.parse(test);
			chrome.storage.local.set(test2, function() {alert("MTI data imported .")});
		}
		reader.readAsText(file);
		location.reload();
	}
	const loadEditorContent = ()=>{
		return dataStorage.load().then(function(injectionData)
		{
			if (!injectionData) return;
			alert(Object.values(injectionData) + " |\n "+ Object.keys(injectionData) +" |\n "+chk_st.checked +" |\n"+Array.isArray(injectionData.opt));
			let color=injectionData.color;
			let opt=injectionData.opt;
			opt0.checked=opt[1],opt1.checked=opt[2],opt2.checked=opt[3];
			
			chrome.storage.local.get({
				dfc: "#0878A5"
			}, function (items) {
				defaultColor=items.dfc;
				if( color === "default") color=defaultColor;	
				else color=injectionData.color;
				hexInput.value=color;
				hexToHsl(color);
				hexToColor();
				dmn_inp.value = injectionData.domain;
				currentInjectionData = injectionData;
				metaThemeColor.setAttribute("content", color);
			});
			chk_st.checked=opt[0];
		});
	}
	const saveEditorContent = ()=>{ 
		var status = document.getElementById('status');
		status.textContent = 'Options saved. Reload the website page to apply changes'; 
		chrome.storage.local.set({dfc:defaultColor})
		let newDomain = dmn_inp.value;
		if (currentInjectionData && currentInjectionData.domain !== newDomain)
			dataStorage.remove(currentInjectionData.domain);
		let injectionData = new InjectedData(newDomain,hexInput.value,[chk_st.checked,opt0.checked,opt1.checked,opt2.checked]);
		currentInjectionData = injectionData;
		alert(Object.values(injectionData) + " |\n "+ Object.keys(injectionData) +" |\n "+chk_st.checked);
		dataStorage.save(injectionData);
		setTimeout(function(){
			status.textContent = ''; 
		},2000);
	}
	document.addEventListener("DOMContentLoaded", ()=>
	{
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs)
		{
			window.tab = tabs[0];loadEditorContent().then(() =>{evList();});
		})
	})
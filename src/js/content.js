(function()
{
	const rgb2hex=(rgb)=>{
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
		 ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		 ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		 ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	   }
	const removeDup=(arr)=>{
		let unique_array = Array.from(new Set(arr));
		return unique_array;
	}
	Array.prototype.remove=function(){
		var w, a= arguments, L= a.length, ax;
		while(L && this.length){w= a[--L];while((ax= this.indexOf(w))!= -1){this.splice(ax, 1);}}
		return this;
	}
    let dataStorage = new InjectedDataStorage(new DataStorage());
	dataStorage.load().then(injectionData =>
	{	
		if (!injectionData) return;
		let opt=injectionData.opt;
		if(!opt[0])return;
		console.log("InjectionData on this website is enabled");
		document.addEventListener("DOMContentLoaded", function()
		{	
			console.log("DOM loaded:");
			var bgColor = injectionData.color;
			const getCFromW =(z)=>{
				var colors=[],gvc=document.elementsFromPoint(30,1);
				gvc.forEach(el => {colors.push(getComputedStyle(el).backgroundColor);colors.push(el.style.backgroundColor);});
				if(colors.length > 0){colors.push(document.body.style.backgroundColor);colors.push(getComputedStyle(document.body).backgroundColor);}
				colors = colors.filter(function(e){return e});//Remove empty ,null,undefined values
				colors=removeDup(colors);//Remove duplicates
				if(z) colors.remove('rgba(0, 0, 0, 0)','rgba(255, 255, 255, 0)','rgb(0, 0, 0)','rgb(255, 255, 255)');//Remove white color
				return colors[0];
			}
			const injectC = () =>{
				if (document.querySelectorAll('meta[name="theme-color"]').length > 0) {
					var metaThemeColor = document.querySelector("meta[name=theme-color]");
					metaThemeColor.setAttribute("content", bgColor);
				}else {var link = document.createElement('meta');link.setAttribute('name', 'theme-color');
					link.setAttribute('content', bgColor);document.getElementsByTagName('head')[0].appendChild(link);
				}
			}
			chrome.storage.local.get({
				dfc: "#0878A5"
			}, function (items) {
				if(bgColor == "default"){
					console.log("bgColor is default , check user option and let's auto retrieve color from website");
					if(opt[1]){
						console.log("opt0 is true ");
						bgColor=getCFromW(opt[2]);
						if(bgColor.includes("rgb"))bgColor=rgb2hex(bgColor);
						console.log("Test after auto retrieve color : bgColor - >> "+ bgColor);
						//Save Data
						dataStorage.remove(injectionData.domain);
						let newData = new InjectedData(injectionData.domain,bgColor,[true,true,true,true]);
						dataStorage.save(newData);
						console.log(" Data saved ->> "+injectionData.toString());
						if(!bgColor)bgColor=items.dfc;
						injectC();
						
					}else{
						console.log("opt0 is false ");
						bgColor=items.dfc;
						injectC();
					}
				}
				if(opt[3]){
					console.log("opt2 is true ");
					  window.setInterval(function(){
						 bgColor=getCFromW(opt[2]);
						 console.log(bgColor);
						 injectC();
					  }, 600);
				}
				else {
					if(!bgColor )bgColor=items.dfc;
					injectC();
				}
				console.log("Injected hex color ->> "+bgColor);
			});
		});
	})
})()
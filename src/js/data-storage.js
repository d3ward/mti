(function () {
	class DataStorage {
		load(key) {return new Promise(function (resolve, reject) {chrome.storage.local.get(key, data => resolve(data[key]));});}
		loadAllKeys() {return new Promise(resolve => chrome.storage.local.get(null, allItems => resolve(Object.keys(allItems))));}
		save(key, value) {
			let data = {};
			data[key] = value;
			chrome.storage.local.set(data);
		}
		remove(key) {chrome.storage.local.remove(key)}
	}
	window.DataStorage = DataStorage;
	class InjectedData {
		constructor(domain,color,opt,bl) {
			this.color = color ? color : "default";
			this.domain = domain;
			this.opt= (opt)? opt: [false,false,false,false];
			this.bl = bl;
			
		}
		serialize() {
			return {
				color: this.color,
				domain: this.domain,
				opt: this.opt,
				bl: this.bl
			}
		}
		static deserialize(key, serializedData) {
			return new InjectedData(key, serializedData.color,serializedData.opt ,serializedData.bl);
		}
	}
	window.InjectedData = InjectedData;
	function wildcardMatch(find, source) {
		find = find.replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|]/g, "\\$&");
		find = find.replace(/\*/g, ".*");
		find = find.replace(/\?/g, ".");
		var regEx = new RegExp(find, "i");
		return regEx.test(source);
	}
	class InjectedDataStorage {
		constructor(dataStorage) {this.dataStorage = dataStorage;}
		load() {
			let hostName = InjectedDataStorage.getCurrentDomain();
			return this.dataStorage.loadAllKeys().then(allKeys => {
				for (let key of allKeys) {
					if (!wildcardMatch(key, hostName)) continue;
					return this.dataStorage.load(key).then(value => InjectedData.deserialize(key, value));
				}
				return false;
			})
		}
		remove(key) {this.dataStorage.remove(key);}
		save(injectedData) {this.dataStorage.save(injectedData.domain, injectedData.serialize())}
		static getCurrentDomain() {
			var url = window.location.href;
			if (window.tab && window.tab.url) url = tab.url;
			console.log(url);
			if(url.match(/[^\/]+\/\/[^\/]+/) != undefined)
			return url.match(/[^\/]+\/\/[^\/]+/)[0];
		}
	}
	window.InjectedDataStorage = InjectedDataStorage;
})()
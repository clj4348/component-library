var templateHtml =`<div>
				<div class="city-mask"
					@click="maskHide"
					v-show="maskShow === 'show'">
				</div>
				<div class="city-con" 
					ref="cityConHeight" 
					:style="cityConStyle"> 
				<div class="all-area">
					<p class="all-area-title">所有地区</p>
					<div class="close-city-con" @click="maskHide">
						<span class="close-city-line"></span>
					</div>
				</div>
				<div class="city-title-con">
					<ul class="city-title-list">
					<li class="city-title-item"
						@click="titSelect(index)"
						:class="{'city-act': index == titAct}"
						v-for="(titItem, index) in addressTitList" 
						v-show="index <= check">
			<span v-html="titItem.text"></span>
			</li>
			</ul>
			<ul class="city-content-list" ref="cityDefaultScroll" v-show="addressNum==0">
			<li class="city-content-item"
			:class="{'city-select-act': index == provinceSelectAct}"
			v-for="(item, index) in addressList" @click="cityChange(item, index)"
			v-html="item.text"
			:key="item.value">
			</li>
			</ul>
			<ul class="city-content-list" v-show="addressNum==1">
			<li class="city-content-item"
			:class="{'city-select-act': index == citySelectAct}"
			v-for="(item, index) in cityList"
			@click="districtChange(item, index)"
			:key="item.value"
			v-html="item.text">
			</li>
			</ul>
			<ul class="city-content-list" v-show="addressNum==2">
			<li class="city-content-item"
			:class="{'city-select-act': index == districtSelectAct}"
			v-for="(item, index) in district"
			@click="streetChange(item, index)"
			:key="item.value"
			v-html="item.text">
			</li>
			</ul>
			<ul class="city-content-list" v-show="addressNum==3">
			<li class="city-content-item"
			:class="{'city-select-act': index == streetSelectAct}"
			v-for="(item, index) in streetList" @click="completeAddress(item, index)"
			:key="item.value" v-html="item.text">
			</li>
			</ul>
			</div>
			</div>
			</div>`;
var CitysComponent = {
	data: function () {
		return {
			// 标题选择数据
			addressTitList: [{
					'text': '请选择省'
				},
				{
					'text': '请选择市'
				},
				{
					'text': '请选择区'
				},
				{
					'text': '请选择街道'
				}
			],
			cityConH: 0, //元素自身的高度
			windowH: this.getViewportSize().h,
			cityConStyle: {
				top: this.getViewportSize().h + 'px'
			},
			addressList: [],
			cityList: [],
			district: [],
			streetList: [],
			addressNum: 0, // 0为省， 1为市, 2为区, 3为街道
			titAct: 0,
			check: 0,
			maskShow: 'hide',
			provinceSelectAct: null,
			citySelectAct: null,
			districtSelectAct: null,
			streetSelectAct: null,
			cityData: {
				areaProvinceName: '',
				areaCityName: '',
				areaRegionName: '',
				areaStreetName: ''
			}
		}
	},

	template: templateHtml,
	methods: {
		// 获取屏幕高度
		getViewportSize: function () {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		},
		getAreaDataObj: function () {
			this.addressList = citys
		},
		// 地址选择的高亮切换
		titSelect: function (index) {
			this.titAct = index
			this.addressNum = index
		},

		// 获取城市列表方法
		cityChange: function (cityItem, index) {
			this.addressNum = 1
			this.titAct = 1
			this.check = this.addressNum
			this.provinceSelectAct = index
			this.citySelectAct = null
			this.district = [] // 重置区
			this.streetList = [] // 重置街道
			this.cityList = cityItem.children
			this.addressTitList[1].text = '请选择市'
			this.addressTitList[0].text = cityItem.text

			this.cityData.areaProvinceName = cityItem.text;
			this.cityData.areaProvinceId = cityItem.value;
		},
		// 获取区列表方法
		districtChange: function (districtItem, index) {
			this.addressNum = 2
			this.check = this.addressNum
			this.titAct = 2
			this.districtSelectAct = null
			this.citySelectAct = index
			this.district = [] // 重置区
			this.streetList = [] // 重置街道
			this.district = districtItem.children
			this.addressTitList[2].text = '请选择区'
			this.addressTitList[1].text = districtItem.text

			this.cityData.areaCityName = districtItem.text;
			this.cityData.areaCityId = districtItem.value;
		},
		// 获取街道列表方法
		streetChange: function (streetItem, index) {
			this.addressNum = 3
			this.check = this.addressNum
			this.streetSelectAct = null
			this.districtSelectAct = index
			this.titAct = 3
			this.addressTitList[3].text = '请选择街道'
			this.addressTitList[2].text = streetItem.text
			this.streetList = streetItem.children

			this.cityData.areaRegionName = streetItem.text;
			this.cityData.areaRegionId = streetItem.value;
		},
		// 选择省市区街道完成
		completeAddress: function (addressItem, index) {
			this.streetSelectAct = index
			this.addressTitList[3].text = addressItem.text
			this.cityData.areaStreetName = addressItem.text;
			this.cityData.areaStreetId = addressItem.value;
			this.$emit('cityselect', this.cityData)
			this.maskHide()
		},
		// 蒙版显示
		showCityCon: function (params) {
			let arrIndex = [];
			// 地址的索引
			if(params){
				for (var i = 0; i < this.addressList.length; i++) {
					if (this.addressList[i].text == params.areaProvinceName) {
						arrIndex.push(i)
						for (var j = 0; j < this.addressList[i].children.length; j++) {
							if (this.addressList[i].children[j].text === params.areaCityName) {
								arrIndex.push(j)
								for (var k = 0; k < this.addressList[i].children[j].children.length; k++) {
									if (this.addressList[i].children[j].children[k].text ===  params.areaRegionName) {
										arrIndex.push(k)
										for (var f = 0; f < this.addressList[i].children[j].children[k].children.length; f++) {
											if (this.addressList[i].children[j].children[k].children[f].text === params.areaStreetName) {
												arrIndex.push(f)
												break;
											}
										}
										break;
									}
								}
								break;
							}
						}
						break;
					}
				}
				this.titAct = 3; // 默认显示
				this.addressNum = 3;
				this.check = 3;
				this.provinceSelectAct = arrIndex[0];
				this.citySelectAct = arrIndex[1];
				this.districtSelectAct = arrIndex[2];
				this.streetSelectAct = arrIndex[3];

				this.cityList = this.addressList[arrIndex[0]].children;
				this.district = this.cityList[arrIndex[1]].children;
				this.streetList = this.district[arrIndex[2]].children;
				
				this.cityData.areaProvinceName = this.addressList[arrIndex[0]].text;
				this.cityData.areaProvinceId = this.addressList[arrIndex[0]].value;
				this.cityData.areaCityName = this.cityList[arrIndex[1]].text;
				this.cityData.areaCityId = this.cityList[arrIndex[1]].value;
				this.cityData.areaRegionName = this.district[arrIndex[2]].text;
				this.cityData.areaRegionId = this.district[arrIndex[2]].value;
				this.cityData.areaStreetName = this.streetList[arrIndex[3]].text;
				this.cityData.areaStreetId = this.streetList[arrIndex[3]].value;

				// tab栏的初始化
				this.addressTitList[0].text = this.addressList[arrIndex[0]].text
				this.addressTitList[1].text = this.cityList[arrIndex[1]].text
				this.addressTitList[2].text = this.district[arrIndex[2]].text
				this.addressTitList[3].text = this.streetList[arrIndex[3]].text
			}
			document.activeElement.blur();
			this.maskShow = "show"
			this.cityConH = this.$refs.cityConHeight.offsetHeight;
			this.cityConStyle.top = this.windowH - this.cityConH + 'px';
			let city = this.$refs.cityDefaultScroll.children
			for (var i = 0; i < city.length; i++) {
				if (i == arrIndex[0]) {
					this.$refs.cityDefaultScroll.scrollTo(0, city[i].offsetTop - 90)
				}
			}
		},
		
		// 蒙版隐藏
		maskHide: function () {
			this.maskShow = "hide"
			this.cityConStyle.top = this.windowH + 'px'
		}
	},
	mounted: function () {
		this.getAreaDataObj()
	}
}
Vue.component('CitysComponent', CitysComponent)
var app = new Vue({
	el: '#city',
	data: function () {
		return {
			defaultCityList: [],
			defaultCity: {}
		}
	},
	computed: {
		fullName: function () {
			return this.defaultCity.areaProvinceName + this.defaultCity.areaCityName + this.defaultCity.areaRegionName + this
				.defaultCity.areaStreetName
		}
	},
	methods: {
		showCityCon: function (data) {

			this.$refs.maskTrigger.showCityCon(this.defaultCity);
		},
		citySelect: function (data) {
			this.defaultCity = data
		}
	},
	mounted: function () {
		this.defaultCity = {
			'areaProvinceName': '广东',
			'areaCityName': '深圳市',
			'areaRegionName': '南山区',
			'areaStreetName': '招商街道'
		}
	}
})

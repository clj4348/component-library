var cuttingImg = {
	data: function() {
		return {
			leftSwitch: true,
			croppable: false,
			imgSize: null, // 缓存img的大小变量
			imgWidth: null, // 裁剪前的图片宽度
			imgHeight: null, // 裁剪前图片的高度
			vasWidth: null, // 裁剪后图片的宽度
			vasHeight: null, // 裁剪后的图片高度
			imgDataForm: this.imgData,
			cropperurl: null
		}
	},

	props: {
		headimg: String,
		id: String,
		left: Object
	},

	// 前端的模板
	template: '<div class="cut-header-mask" :style="left">' +
		'<span class="white-big back-cancle" @click="headMask">取消</span>' +
		'<div class="container">' +
		'<div id="imgTest">' +
		'<img id="image" :src="headimg">' +
		'</div>' +
		'</div>' +
		'<div class="cutting"  @click="complete">保存</div>' +
		'</div>',

	methods: {
		// 裁切头像画布
		getRoundedCanvas: function(sourceCanvas) {
			var canvas = document.createElement('canvas'); // 获取画布
			var context = canvas.getContext('2d'); // 2D文本绘制
			var width = sourceCanvas.width; // 裁剪图片的宽
			var height = sourceCanvas.height; // 裁剪图片的高
			canvas.width = width;
			canvas.height = height;
			this.vasWidth = canvas.width;
			this.vasHeight = canvas.height;
			context.imageSmoothingEnabled = true;
			context.drawImage(sourceCanvas, 0, 0, width, height); // 裁剪图片的大小
			context.globalCompositeOperation = 'destination-in';
			context.beginPath();
			return canvas;
		},

		headMask: function() {
			this.left.left = '100%'
		},

		//**base64  转 blob**
		dataURLtoBlob: function(dataurl) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while(n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {
				type: mime
			});
		},

		// 更换头像事件
		fileTestChange: function(event) {
			var _this = this
			var et = event.target
			var windowURL = "";
			windowURL = window.URL || window.webkitURL;
			var dataURL = null; // 初始化图片url的值
			if(!et || !et.files || !et.files[0] || !/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(et.files[0].name)) {
				return;
			};
			if(et.files.length > 1) {
				mui.toast('只能上传一张')
			}

			dataURL = windowURL.createObjectURL(et.files[0]);
			image.src = dataURL;
			this.left.left = 0;
			this.cropperurl = this.cropper();
			this.cropperurl.reset().replace(dataURL);

		},
		// 裁剪
		cropper: function() {
			var _this = this
			var image = document.getElementById('image')
			return new Cropper(image, {
				aspectRatio: 1.0,
				viewMode: 1,
				guides: false, // 裁剪框虚线 默认true有
				guides: false, // 裁剪框虚线 默认true有
				dragMode: "move", // 背景图移动
				ready: function() {
					_this.croppable = true;
				}
			})
		},
		// 保存
		complete: function() {
			var _this = this
			this.left.left = '100%';
			var croppedCanvas;
			var roundedCanvas;
			if(!this.croppable) {
				return;
			}
			// 裁剪
			croppedCanvas = this.cropperurl.getCroppedCanvas();

			// 裁剪成圆形
			roundedCanvas = this.getRoundedCanvas(croppedCanvas);
			var vasSize = (this.vasHeight * this.vasWidth) / (this.imgHeight * this.imgWidth) * 0.5 * this.imgSize / 1024;

			setTimeout(function() {
				if(vasSize > 512) {
					_this.headimg = roundedCanvas.toDataURL('image/jpeg', 0.5);
				} else {
					_this.headimg = roundedCanvas.toDataURL('image/jpeg');
				}
				var imgUrl = _this.dataURLtoBlob(_this.headimg);
				var formdata = new FormData();
				formdata.append("img", imgUrl);
				formdata.append("id", this.id);
				//formdata.enctype="multipart/form-data";
				axios.post('http://192.168.1.148:8765/oss/compress/put/userHeadImg',
					formdata
				).then((res) => {
					_this.$emit('changeheadimg', res.data.data)
				}, (err) => {
					console.log(err)
				})
			}, 200)
		}
	}
}
Vue.component('cuttingImg', cuttingImg)

var app = new Vue({
	el: '#app',
	data: function() {
		return {
			headImg: '',
			id: 'zxcv',
			left: {
				left: '100%'
			}
		}
	},

	methods: {
		changeheadimg: function(val) {
			this.headImg = val
		},
		fileTest: function(event) {
			event.target.value = '';
		},
		clickDt: function() {
			this.$refs.profile.fileTestChange(event);
		}
	}
})
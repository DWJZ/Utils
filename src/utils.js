/**
 * 当前页面下载文件
 * @param  {String} url [下载地址 get格式] 
 * @return {none}     
 */
export function downloadFile(url) {
	let iframe = document.createElement('iframe')
	iframe.style.display = 'none'
	iframe.src = url
	iframe.onload = function() {
		document.body.removeChild(iframe)
	}
	document.body.appendChild(iframe)
}

/**
 * 格式化时间，可选择转换格式
 * @param  {[String || Date]} time [时间数据]
 * @param  {String} fmt  [转换格式]
 * @return {[String]}      [转换后数据]
 */
export function dateFormat(date, fmt = 'YYYY-MM-DD hh:mm:ss') {
	date = new Date(date)
	let options = {
		"M+": date.getMonth() + 1 + '', //月份 
		"D+": date.getDate() + '', //日 
		"h+": date.getHours() + '', //小时 
		"m+": date.getMinutes() + '', //分 
		"s+": date.getSeconds() + '', //秒 
		"q+": Math.floor((date.getMonth() + 3) / 3) + '', //季度 
		"S": date.getMilliseconds() + '' //毫秒 
	};
	// 判断年
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (let key in options) {
		if (new RegExp(`(${key})`).test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (options[key]) : ((`00${options[key]}`).substr(options[key].length)));
		}
	}
	return fmt;
}

/**
 * http请求
 * @param  {String}   options.url  [接口地址]
 * @param  {Object}   options.data [请求体参数]
 * @param  {String || Bolean}   successText  [成功提示]
 * @param  {String}   failedText} [失败提示]
 * @param  {Function} cb           [回调函数]
 */
export function request({
	url = '',
	data = {},
	successText,
	failedText,
	headers = {},
	formData
} = {}, cb) {

	let _this = this
	axios
		.post(baseUrl + url, formData ? formData : qs.stringify(data), headers)
		.then(response => {
			// 失败处理
			if (response.data.code === 1) {
				this.$message({
					message: response.data.msg || failedText,
					type: 'warning'
				})
			} else {
				// 成功处理
				if (successText) {
					this.$message({
						message: response.data.msg || successText,
						type: 'success'
					})
				}
				cb(response.data)
			}
		})
		.catch(e => {
			// 错误处理
			if (!(e.response)) {
				console.error(e)
				this.$message({
					message: e,
					type: 'error'
				})
			} else if (e.response.status == 401) {
				// 登录过时后台返回 status 401, 此时返回登录页面
				function unauthorizedConfirm() {
					sessionStorage.setItem("userInfo", null)
					_this.$alert('登录失效，请重新登录！', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							_this.$router.push('/login')
						}
					});
				}

				if (unauthorizedList.length < 1) {
					unauthorizedList.push(unauthorizedConfirm)
					setTimeout(() => {
						unauthorizedList[0]()
						unauthorizedList = []
					}, 1000)
				}



				// this.$confirm('登录失效，请重新登录！', '提示', {
				//   confirmButtonText: '确定',
				//   showCancelButton: false,
				//   type: 'warning'
				// }).then(() => {
				//   this.$router.push('/login')
				// }).catch(() => {
				//   this.$router.push('/login')
				// });
				// this.$router.push('/login')
			} else {
				this.$message({
					message: '网络异常',
					type: 'error'
				})
			}
		});
}

/**
 * 添加或删除数组中的子元素
 * @param  {String || Number} item      [数组元素]
 * @param  {Array} array [数组]
 * @return {Array}           [数组]
 */
export function togglerItemInArray(item, array) {
	let index = array.indexOf(item)
	if (index == -1) {
		array.push(item)
	} else {
		array.splice(index, 1)
	}
}

/**
 * 深拷贝
 * @param  {Object} obj [被拷贝对象]
 * @return {Object}     [拷贝对象]
 */
export function jsonDeepCopy(obj) {
	let newObj = {}
	for (let key in obj) {
		newObj[key] = obj[key]
	}
	return newObj
}
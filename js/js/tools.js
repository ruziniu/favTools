//weather mapping
var weatherType = 'sunny,cloudy,overcast,shower,thunder_shower,rain_sleet,sleet,';
weatherType += 'rain_light,rain_mid,rain_large,rain_heavy,rain_storm,rain_big_storm,';
weatherType += 'snow_shower,snow_light,snow_mid,snow_large,snow_heavy,fog,rain_sleet,sand_storm,';
weatherType += 'dust,sand_blowing,sand_storm_big,haze,hail';
weatherType = weatherType.split(',');
var weatherCHN = '晴,多云,阴,阵雨,雷阵雨,雷阵雨伴有冰雹,雨夹雪,小雨,中雨,大雨,暴雨,大暴雨,特大暴雨,';
weatherCHN += '阵雪,小雪,中雪,大雪,暴雪,雾,冻雨,沙尘暴,浮尘,扬沙,强沙尘暴,霾,冰雹';
weatherCHN = weatherCHN.split(',');

var Weather = {
	sixDayApi : 'http://m.weather.com.cn/data/', //http://m.weather.com.cn/data/101010100.html
	liveApi : 'http://www.weather.com.cn/data/sk/',//http://www.weather.com.cn/data/sk/101010100.html
	// cityIdApi : 'http://61.4.185.48:81/g/',
	cityIdApi : 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',
	cityId : localStorage && localStorage.getItem('cityId'),
	weatherInfo : localStorage && localStorage.getItem('weatherInfo'),
	showFutureDate : function(baseDate,n){
		var d = new Date(new Date(baseDate)-0+n*86400000);
		var week = ['日','一','二','三','四','五','六'];
		// d = d.getFullYear() + "年" +  (d.getMonth()+1) + "月" + d.getDate() + '日 周' + week[d.getDay()];
		d = (d.getMonth()+1) + "月" + d.getDate() + '日 周' + week[d.getDay()];
		return d; 
	},
	getWeatherType : function(chStr){
		var str = null;
		if(chStr.indexOf('转') > -1){
			str = chStr.split('转')[0];
		}else{
			str = chStr;
		}
		for(var i=0; i<weatherCHN.length; i++){
			if(str.indexOf(weatherCHN[i]) > -1){
				return weatherType[i];
			}
		}
	},
	getCityId : function(){
		// localStorage && localStorage.setItem('cityId','101010100');
		// Weather.cityId = '101010100';
		// Weather.getData();

		$.ajax({
			url : Weather.cityIdApi,
			dataType : 'script',
			success : function(data,status,xhr){
				var ipInfo = remote_ip_info, cityJSON = cityJSON;
				var city = ipInfo.city, cityId = null;
				for(var k in cityJSON){
					if(k == city){
						cityId = cityJSON[k];
					}
				}
				//default "BeiJing"
				cityId = cityId || '101010100';
				Weather.cityId = cityId;
				localStorage && localStorage.setItem('cityId',cityId);
				// alert(Weather.cityId)
				Weather.getData();
			},
			error : function(xhr,sta,err){
				alert('你在哪里？还没找到您的位置~')
				//get city id again
				// Weather.getCityId();
			}
		});
	},
	parseData : function(dataJson){
		var weatherIcon = Weather.getWeatherType(dataJson['weather1']);
		//base date
		var today = new Date();
		var updateDate = dataJson.date_y;
		var upDay = updateDate.split('月')[1].split('日')[0];
		var baseDate = today.getFullYear()+ '/' +(today.getMonth()+1)+ '/' + upDay;

		var template = '<div class="city '+ weatherIcon +'">';
		template += '<div>'+ dataJson.city +'( '+ dataJson.city_en +' )</div><div>'+ dataJson.date_y +'<br />'+ dataJson.week +'</div>';
		template += '<div>'+ dataJson['temp1'] + ' ' + dataJson['weather1'] + ' ' +dataJson['wind1'] + ' 风力:' + dataJson['fl1'] +'</div></div>';

		template += '<table class="clearfix trend"><caption>五日天气：</caption>';
		for(var i=2; i<=6; i++){
			template += '<tr><td>'+ Weather.showFutureDate(baseDate,i-1) +'</td><td><div>'+ dataJson['weather'+i] +' '+ dataJson['temp'+i] +'</div>'
			template += '<div>'+ dataJson['wind'+i] +' 风力:'+ dataJson['fl'+i] +'</div></td></tr>';
		}
		template += '</table>';

		template += '<dl class="index clearfix"><dt>穿衣指数：'+ dataJson.index +'</dt><dd>'+ dataJson.index_d+'</dd>';
		template += '<dt>48小时穿衣指数：'+ dataJson.index48 +'</dt><dd class="clearfix">'+ dataJson.index48_d +'</dd>';
		template += '<dt class="col">紫外线指数：<br>'+ dataJson.index_uv +'</dt><dt class="col">48小时紫外线：<br>'+dataJson.index48_uv+'</dt>';
		template += '<dt class="col">洗车指数：<br>'+dataJson.index_xc+'</dt><dt class="col">过敏指数：<br>'+dataJson.index_ag+'</dt><dt class="col">晨练指数：<br>'+dataJson.index_cl+'</dt>';
		template += '<dt class="col">舒适度指数：<br>'+dataJson.index_co+'</dt><dt class="col">晾晒指数：<br>'+dataJson.index_ls+'</dt><dt class="col">旅游指数：<br>'+dataJson.index_tr+'</dt>';
		template += '</dl>';
		
		return template;
	},
	getData: function(){
		if(localStorage && localStorage.getItem('weatherInfo')){
			var json = JSON.parse(localStorage.getItem('weatherInfo')) ;
			var template = Weather.parseData(json);
			$('#weatherInfo').html(template);
		}else{
			$.getJSON("http://jinlongz.duapp.com/weather.php?cid="+ Weather.cityId +"&callback=?", function(data) {
				// console.log(data);
				var res = data;
				
				var template = Weather.parseData(res);
				$('#weatherInfo').html(template);

				//hide loading
				$('#weatherInfo').prev('.loading').fadeOut();

				res = JSON.stringify(res);
				localStorage && localStorage.setItem('weatherInfo',res);
			});
		}
		
	},
	updateData: function(){
		// localStorage.removeItem('cityId');
		localStorage.removeItem('weatherInfo');
		Weather.init();
	},
	init: function(){
		if(localStorage && localStorage.getItem('cityId')){
			Weather.getData();
		}else{
			this.getCityId();
		}
	}
};

var Calculator = {
	'result' : '',
	'resObj' : $('#calcContainer .result'),
	'del' : function(){
		if(Calculator.result){
			var $resObj = Calculator.resObj;
			var resVal = $resObj.html().slice(0,-1);
			$resObj.html(resVal);
			Calculator.result = resVal;
		}
	},
	'clear' : function(){
		if(Calculator.result){
			Calculator.resObj.html('');
			Calculator.result = '';
		}
	},
	'eval' : function(){
		// debugger;

		if(Calculator.result){
			var val = eval(Calculator.result);
			Calculator.resObj.html(val);
			Calculator.result = val;
		}
	},
	'percent' : function(){
		if(Calculator.result){
			var val = eval(Calculator.result);
			val = val/100;
			Calculator.resObj.html(val);
			Calculator.result = val;
		}
	},
	'sqrt' : function(){
		if(Calculator.result){
			var val = Calculator.result;
			val = eval(Math.sqrt(val));
			Calculator.resObj.html(val);
			Calculator.result = val;
		}
	},
	'reciprocal' : function(){
		if(Calculator.result){
			var val = Calculator.result;
			val = eval('1/('+val+')');
			Calculator.resObj.html(val);
			Calculator.result = val;
		}
	},
	'pi' : function(){
		var val = Calculator.resObj.html() + '3.1415926';
		Calculator.resObj.html(val);
		Calculator.result += '3.1415926';
	},
	'commonAct' : function(btn){
		var addVal = $(btn).text();
		var val = Calculator.resObj.html() + addVal;
		Calculator.resObj.html(val);
		Calculator.result = Calculator.result + addVal;
	},
	'init': function(){
		var _this = Calculator;
		var calcTable = {
			'del' : _this.del,
			'clear' : _this.clear,
			'eval' : _this.eval,
			'percent' : _this.percent,
			'pi' : _this.pi,
			'sqrt' : _this.sqrt,
			'reciprocal' : _this.reciprocal
		};
		$('#calcContainer tbody a').each(function(){
			var $btn = $(this);			
			$btn.on('vclick',function(){
				var act = $btn.attr('act');
//				alert(act);
				if(!act){
					_this.commonAct($btn);
				}else{
					if(calcTable.hasOwnProperty(act)){
						calcTable[act]();
					}
				}

			});
		});

	}
};

//http://www.pm25.in/api_doc
var PM25 = {
	api: 'http://www.pm25.in/api/querys/aqi_details.json?stations=no&token=pCdL4M2ysZktMGhGojTn',
	city: localStorage && localStorage.getItem('city'),
	getCity: function(){
		$.ajax({
			url: 'http://j.maxmind.com/app/geoip.js',
			dataType: 'script',
			success: function(data,status,xhr){
				var city = (geoip_city && geoip_city()) || 'beijing';
				city = city.toLowerCase();
				localStorage && localStorage.setItem('city', city);

				PM25.getData(city);

			},
			error: function(xhr,sta,err){
				console.log(err);
			}
		});
	},
	getData: function(city){
		$('#pm25').find('.detail').html('加载中...');
		$.ajax({
			url : PM25.api +'&city='+ city,
			dataType : 'jsonp',
			success : function(data,status,xhr){
				// console.log(data)

				if(data.error){
					alert(data.error);
					return;
				}

				var avgInfo = data[0];
				var aqi = avgInfo.aqi, area = avgInfo.area, pm25 = avgInfo.pm2_5;
				var co = avgInfo.co, no2 = avgInfo.no2, o3 = avgInfo.o3, pm10 = avgInfo.pm10, so2 = avgInfo.so2;
				var quality = avgInfo.quality, updateTime = avgInfo.time_point;
				var TEMP = '<dl><dt class="line">'+ area +'（空气质量指数）</dt><dd class="line large">' +aqi+ '（'+ quality +'）</dd>';
				TEMP += '<dt>PM2.5：</dt><dd>'+ pm25 +'</dd><dt>PM10：</dt><dd>'+ pm10 +'</dd><dt>一氧化碳：</dt><dd>'+ co +'</dd>';
				TEMP += '<dt>二氧化氮：</dt><dd>'+ no2 +'</dd><dt>臭氧：</dt><dd>'+ o3 +'</dd><dt>二氧化硫：</dt><dd>'+ so2 +'</dd>';
				TEMP += '</dl>';

				$('#pm25').find('.detail').html(TEMP);
			},
			error : function(xhr,sta,err){
				console.log(err);
			}
		});
	},
	init: function(){
		if(this.city){
			this.getData(this.city);
		}else{
			this.getCity();
		}
	}
};

var Transit = {
	findWay: function(options){
		var options = options || {};
		var map = new BMap.Map(options.mapContainer);            // 创建Map实例
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 18);

		var transit = new BMap.TransitRoute(map, {
		  renderOptions: {map: map, panel: options.resultContainer, autoViewport: true},
		  policy: options.choice
		});
		transit.search(options.start, options.end);
	},
	searchLine: function(options){
		var options = options || {};
		var map = new BMap.Map(options.mapContainer);            // 创建Map实例
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 18);

		var busline = new BMap.BusLineSearch(map,{
		    renderOptions:{map:map,panel: options.resultContainer},
	        onGetBusListComplete: function(result){
	           if(result) {
	             var fstLine = result.getBusListItem(0);//获取第一个公交列表显示到map上
	             busline.getBusLine(fstLine);
	           }
	        }
		});
	    var busName = options.line;
	    busline.getBusList(busName);
	},
	init: function(){
		$('#findWay .searchWay').on('touchend',function(){
			var $start = $('#startStop'), $end = $('#endStop');
			var start = $start.val(), end = $end.val();
			var choice = $('#findWay').find(':selected').val();
			if(!start || !end){
				return;
			}

			Transit.findWay({
				mapContainer : 'baiduMap',
				resultContainer : 'mapResult',
				choice : choice,
				start : start,
				end : end
			});

			//show copy button
			$('#copySelectedWay').css('visibility','visible');

		});
		var $searchLine = $('#searchLine');
		$searchLine.find('.searchStop').on('touchend',function(){
			var line = $searchLine.find('.lineName').val();
			if(!line){return;}

			Transit.searchLine({
				mapContainer: 'baiduMap',
				resultContainer: 'mapResult',
				line: line
			});

			//hide copy button
			$('#copySelectedWay').css('visibility','hidden');

		});
		//copy selected line
		$('#copySelectedWay').on('touchend',function(){
			var copiedText = '', start = $('#startStop').val(), end = $('#endStop').val();
			if(!start || !end){
				return false;
			}
			copiedText = start +'至'+ end +'的路线：';
			$('#mapResult').find('table tr').each(function(){
				var $this = $(this);
				if($this.attr('style').indexOf('background') > -1){
					copiedText += $this.find('td:eq(1)').text();

					//appcan clipboard
					uexClipboard.copy(copiedText);
					alert("您选中的路线已复制到剪贴板，不信粘贴试试呗~");
				}
			});

			return false;
		});

	}
};

//timer
var Timer = {
	t: null,
	timeObj: {h:0, m:0, s:0},
	currentAct: null,	//current function: 'stopwatch' or 'countdown'
	strToNum: function(h,m,s){
		var h = parseInt(h,10), m = parseInt(m,10), s = parseInt(s,10);
		return {
			h : h,
			m : m,
			s : s
		};
	},
	timeMinus: function(h,m,s){
		var _this = this;
		var t = _this.strToNum(h,m,s);
		var h = t.h, m = t.m, s = t.s;
		if(s > 0){
			s--;
		}else if(s == 0){
			if(m > 0){
				m--;
				s = 59;
			}else if(m == 0){
				if(h > 0){
					h--;
					m = 59;
				}else if(h == 0){
					return false;
					_this.stop();
				}
			}
		}
		h = _this.initNumber(h), m = _this.initNumber(m), s = _this.initNumber(s);
		_this.timeObj = {
			h : h,
			m : m,
			s : s
		};
	},
	timeAdd: function(h,m,s){
		var _this = this;
		var t = _this.strToNum(h,m,s);
		var h = t.h, m = t.m, s = t.s;
		s++;
		if(s >= 60){
			s = 0;
			m++;
			if(m >= 60){
				m = 0;
				h++;
				if(h >= 99){
					return false;
					_this.stop();
				}
			}
		}
		h = _this.initNumber(h), m = _this.initNumber(m), s = _this.initNumber(s);
		_this.timeObj = {
			h : h,
			m : m,
			s : s
		};
	},
	time : function(h,m,s,cb){
		var _this = this;
		_this.timeObj = {h: h, m: m, s: s};
		_this.start(function(){
			var h = _this.timeObj.h, m = _this.timeObj.m, s = _this.timeObj.s;
			_this.timeAdd(h,m,s);
			cb && cb(_this.timeObj);
		},1000);
	},
	countdown : function(h,m,s,cb){
		var _this = this;
		var h = parseInt(h,10), m = parseInt(m,10), s = parseInt(s,10);
		if(h == 0 && m == 0 && s == 0){
			return false;
		}
		_this.timeObj = {h: h, m: m, s: s};
		_this.start(function(){
			var h = _this.timeObj.h, m = _this.timeObj.m, s = _this.timeObj.s;
			_this.timeMinus(h,m,s);
			cb && cb(_this.timeObj);
		}, 1000);

	},
	start: function(cb,interval){
		var interval = interval || 1000;
		if(Timer.t){
			clearInterval(Timer.t);
		}
		if(cb){
			Timer.t = setInterval(function(){
				cb();
			},interval);	
		}
	},
	stop: function(){
		if(Timer.t){
			clearInterval(Timer.t);
		}
	},
	timeout: function(){
		//time's out and vibrate
		var obj = Timer.timeObj;
		var h = parseInt(obj.h,10), m = parseInt(obj.m,10), s = parseInt(obj.s,10);
		if(h == 0 && m == 0 && s == 0){
			uexDevice.vibrate(2000);
			if(Timer.t){
				clearInterval(Timer.t);
			}
		}
	},
	initNumber: function(num){
		var num = parseInt(num,10);
		if(num != 0 && !num){
			return false;
		}
		if(num < 10){
			num = '0'+ num;
		}
		return num+ '';
	},
	initCountdown: function(isPaused){	//countdown
		var $panel = $('#timer').find('.panel');
		var $countdown = $panel.find('.countdown');
		var $showArea = $('#timer .show');
		var $h = $showArea.find('.hour'), $m = $showArea.find('.minute'), $s = $showArea.find('.second');
		var isPaused = isPaused || false; //pause mark
		//pause
		var tObj = null;
		if(isPaused){
			tObj = Timer.timeObj;
			Timer.countdown(tObj.h, tObj.m, tObj.s,function(time){
				$h.html(time.h);
				$m.html(time.m);
				$s.html(time.s);

				//time's out
				Timer.timeout();
			});

			Timer.currentAct = 'countdown';
		}else{
			$countdown.on('touchend',function(){
				var hour = $panel.find('.hour').val(), minute = $panel.find('.minute').val(), second = $panel.find('.second').val();
				hour = Timer.initNumber(hour), minute = Timer.initNumber(minute), second = Timer.initNumber(second);
				if(!hour || !minute || !second){
					return false;
				}
				$h.html(hour);
				$m.html(minute);
				$s.html(second);

				tObj = {h:hour, m:minute, s:second};

				Timer.countdown(tObj.h, tObj.m, tObj.s,function(time){
					$h.html(time.h);
					$m.html(time.m);
					$s.html(time.s);

					//time's out
					Timer.timeout();
				});

				Timer.currentAct = 'countdown';

				return false;
			});
		}
		
	},
	initTime: function(isPaused){	//stopwatch
		var $panel = $('#timer').find('.panel');
		var $timer = $panel.find('.timer');
		var $showArea = $('#timer .show');
		var $h = $showArea.find('.hour'), $m = $showArea.find('.minute'), $s = $showArea.find('.second');
		var isPaused = isPaused || false; //pause mark
		//pause
		var tObj = null;
		if(isPaused){
			tObj = Timer.timeObj;
			var _this = Timer;
			
			_this.time(tObj.h, tObj.m, tObj.s,function(time){
				$h.html(time.h);
				$m.html(time.m);
				$s.html(time.s);
			});

			Timer.currentAct = 'stopwatch';
		}else{
			tObj = {h:0, m:0, s:0}
			$timer.on('touchend',function(){
				var _this = Timer;
				_this.time(tObj.h, tObj.m, tObj.s,function(time){
					$h.html(time.h);
					$m.html(time.m);
					$s.html(time.s);
				});

				Timer.currentAct = 'stopwatch';

				return false;
			});
		}
	},
	init : function(){
		var $panel = $('#timer').find('.panel');
		var $pause = $panel.find('.pause'), $resume = $panel.find('.resume');
		var $showArea = $('#timer .show');
		var $h = $showArea.find('.hour'), $m = $showArea.find('.minute'), $s = $showArea.find('.second');
		
		Timer.initTime();
		Timer.initCountdown();

		//pause
		$pause.on('touchend',function(){
			Timer.stop();
		});
		//resume
		$resume.on('touchend',function(){
			if(Timer.currentAct == 'stopwatch'){
				Timer.initTime(true);
			}else if(Timer.currentAct == 'countdown'){
				Timer.initCountdown(true);
			}
		});

		//exit the timer
		$(window).on('hashchange',function(){
			if(location.hash != '#timer'){
				Timer.stop();
				$h.html('00');
				$m.html('00');
				$s.html('00');
				Timer.timeObj = {h:0, m:0, s:0};
				Timer.t = null;
				Timer.currentAct = null;
			}
		});

	}
};
//standardBody
var StandardBody = {
	calcBMI: function(height,weight){
		if(!height && !weight){return false;}
		var h = parseFloat(height), w = parseFloat(weight);
		var bmi = w/(h*h);
		bmi = Math.round(bmi*10)/10; 
		var res = '';
		if(bmi< 18.5){
			res = '太瘦了，体重过轻对健康有其它影响！';
		}
		if(bmi >= 18.5 && bmi <= 23.9){
			res = '体重正常，继续保持~';
		}
		if(bmi >= 24 && bmi <= 26.9){
			res = '肥胖前期，相关疾病发病的危险性增加!';
		}
		if(bmi >= 27 && bmi <= 29.9){
			res = 'I度肥胖，相关疾病发病的危险性中度增加!';
		}
		if(bmi >= 30){
			res = 'II度肥胖，相关疾病发病的危险性严重增加!';
		}
		if(bmi >= 40){
			res = 'Ⅲ度肥胖，相关疾病发病的危险性非常严重增加!';
		}
		return {
			bmi: bmi,
			res: res
		}
	},
	calcPerfectWeight: function(height,gender){
		var h = parseFloat(height), bmi = '';
		var w = '';
		if(gender == '1'){
			bmi = 24;
		}
		if(gender == '0'){
			bmi = 22;
		}
		w = bmi*h*h;
		return parseInt(w);
	},
	init: function(){
		var $standardBody = $('#standardBody');
		var $calc = $standardBody.find('.calc');
		var $result = $standardBody.find('.result');
		var $bmi = $result.find('.bmi span'), $perfectWeight = $result.find('.perfectWeight span');
		var $note = $result.find('.note span');
		$calc.on('touchend',function(){
			var height = $standardBody.find('.height').val() / 100, weight = $standardBody.find('.weight').val();
			var gender = $standardBody.find(':checked').val();
			var bmiObj = StandardBody.calcBMI(height,weight);
			var bmi = bmiObj.bmi, note = bmiObj.res;
			var perfectWeight = StandardBody.calcPerfectWeight(height,gender);
			$bmi.html(bmi);
			$note.html(note);
			$perfectWeight.html(perfectWeight);

			return false;
		});
	}
};

//Scan code
var Scanner = {
	init: function(){
		function ScannerSuccessCallBack(opCode, dataType, data) {
		    if(dataType==1){
			    $('#codeContent').html(data);
			    	
				var obj = eval('('+data+')');
				if(obj.type == 'QR_CODE'){	//二维码
					//打开浏览器
					uexWidget.loadApp("android.intent.action.VIEW", "text/html", obj.code);
				}else if(obj.type == 'EAN_13'){	//条形码
					var url = 'http://m.baidu.com/s?word=';
					// var url = 'http://www.google.com.hk/search?btnG=&newwindow=1&safe=strict&q=';
					url = url + obj.code +'+'+ encodeURIComponent('价');
					uexWidget.loadApp("android.intent.action.VIEW", "text/html", url);
					
				}else if(obj.type == 'EAN_8'){
					var url = 'http://m.baidu.com/s?word=';
					url = url + obj.code +'+'+ encodeURIComponent('价');
					uexWidget.loadApp("android.intent.action.VIEW", "text/html", url);
				}
	        }
		}
		function ScannerFailedCallBack(data){
			alert(data);
		}

		window.uexOnload = function(){
			uexScanner.cbOpen = ScannerSuccessCallBack;
			uexWidgetOne.cbError = ScannerFailedCallBack;
		};

		$('#scanCodeBtn').on('touchend',function(){
			uexScanner.open();
		});
	}
};

//unit converter
var UnitConverter = {
	type: ['yingcun','yingchi','yingli','li','ma','haomi','limi','gongli','mi','fenmi','zhang','chi','cun','haili','weimi','nami','guangnian','pingfanggongli','gongqin','mu','pingfangmi','pingfanglimi','pingfanggan','pingfangma'],
	typeCN: ['英寸','英尺','英里','里','码','毫米','厘米','公里','米','分米','丈','尺','寸','海里','微米','纳米','光年','平方公里','公顷','亩','平方米','平方厘米','平方竿','平方码'],
	typeAbbr: ['yc','yc','yl','li','ma','hm','lm','gl','mi','fm','zhang','chi','cun','hl','wm','nm','gn','pfgl','gq','mu','pfm','pflm','pfg','pfm'],
	currentObj: null,	//current object
	filter: function(str){
		if(!str){return;}
		var _this = this;
		var str = str.toLowerCase();
		var type = _this.type, cn = _this.typeCN, abbr = _this.typeAbbr;
		var rs = [];
		//loop the abbr
		for(var i=0; i<abbr.length; i++){
			if(str === abbr[i]){
				rs.push({type: type[i], abbr: str, cn: cn[i]});
			}
		}
		//loop the type
		if(rs.length == 0){
			for(var i=0; i<type.length; i++){
				if(str === type[i]){
					rs.push({type: str, abbr: abbr[i], cn: cn[i]});
				}
			}
		}
		//loop the cn
		if(rs.length == 0){
			for(var i=0; i<cn.length; i++){
				if(str === cn[i]){
					rs.push({type: type[i], abbr: abbr[i], cn: str});
				}
			}
		}
		return rs;
	},
	convert: function(num,unit,toUnit){
		var rs = '';
		//长度
		if(unit == '英寸' && toUnit == '厘米'){
			rs = num*2.54;
		}
		if(unit == '英寸' && toUnit == '米'){
			rs = num*0.0254;
		}
		if(unit == '英尺' && toUnit == '米'){
			rs = num*0.3048;
		}
		if(unit == '英里' && toUnit == '米'){
			rs = num*1609.344;
		}
		if(unit == '海里' && toUnit == '米'){
			rs = num*1852;
		}
		if(unit == '公里' && toUnit == '米'){
			rs = num*1000;
		}
		if(unit == '里' && toUnit == '米'){
			rs = num*500;
		}
		if(unit == '码' && toUnit == '米'){
			rs = num*0.9144;
		}
		if(unit == '海里' && toUnit == '公里'){
			rs = num*1.85200;
		}
		if(unit == '英尺' && toUnit == '英寸'){
			rs = num*12;
		}
		if(unit == '英里' && toUnit == '公里'){
			rs = num*1.609344;
		}
		if(unit == '英里' && toUnit == '海里'){
			rs = num*0.868976242;
		}
		if(unit == '英里' && toUnit == '码'){
			rs = num*1760;
		}
		if(unit == '公里' && toUnit == '里'){
			rs = num*2;
		}
		if(unit == '米' && toUnit == '分米'){
			rs = num*10;
		}
		if(unit == '米' && toUnit == '厘米'){
			rs = num*100;
		}
		if(unit == '米' && toUnit == '毫米'){
			rs = num*1000;
		}
		if(unit == '毫米' && toUnit == '微米'){
			rs = num*1000;
		}
		if(unit == '微米' && toUnit == '纳米'){
			rs = num*1000;
		}
		if(unit == '丈' && toUnit == '米'){
			rs = num*3.3333;
		}
		if(unit == '丈' && toUnit == '尺'){
			rs = num*10;
		}
		if(unit == '尺' && toUnit == '寸'){
			rs = num*10;
		}
		if(unit == '尺' && toUnit == '厘米'){
			rs = num*33.33;
		}
		if(unit == '寸' && toUnit == '厘米'){
			rs = num*3.33300;
		}

		//面积
		if(unit == '平方公里' && toUnit == '平方米'){
			rs = num*1000000;
		}
		if(unit == '公顷' && toUnit == '平方米'){
			rs = num*10000;
		}
		if(unit == '亩' && toUnit == '平方米'){
			rs = num*666.6667;
		}
		if(unit == '公顷' && toUnit == '亩'){
			rs = num*14.9999993;
		}
		if(unit == '平方米' && toUnit == '平方厘米'){
			rs = num*10000;
		}
		if(unit == '平方英里' && toUnit == '平方米'){
			rs = num*2589988.11;
		}
		if(unit == '平方英里' && toUnit == '平方公里'){
			rs = num*2.58998811;
		}
		if(unit == '平方竿' && toUnit == '平方米'){
			rs = num*25.2928526;
		}
		if(unit == '平方英尺' && toUnit == '平方米'){
			rs = num*0.09290304;
		}
		
		//体积
		if(unit == '立方米' && toUnit == '立方厘米'){
			rs = num*1000000;
		}
		if(unit == '升' && toUnit == '立方米'){
			rs = num*0.001;
		}
		if(unit == '升' && toUnit == '毫升'){
			rs = num*1000;
		}
		if(unit == '夸脱' && toUnit == '毫升'){
			rs = num*946.352946;
		}
		if(unit == '品脱' && toUnit == '毫升'){
			rs = num*473.176473;
		}
		if(unit == '配克' && toUnit == '升'){
			rs = num*8.809768;
		}
		if(unit == '液体盎司' && toUnit == '毫升'){
			rs = num*28.4130742;
		}

		//重量
		if(unit == '吨' && toUnit == '公斤'){
			rs = num*1000;
		}
		if(unit == '吨' && toUnit == '千克'){
			rs = num*1000;
		}
		if(unit == '公斤' && toUnit == '斤'){
			rs = num*2;
		}
		if(unit == '公斤' && toUnit == '千克'){
			rs = num*1;
		}
		if(unit == '千克' && toUnit == '克'){
			rs = num*1000;
		}
		if(unit == '克' && toUnit == '毫克'){
			rs = num*1000;
		}
		if(unit == '斤' && toUnit == '克'){
			rs = num*500;
		}
		if(unit == '斤' && toUnit == '两'){
			rs = num*10;
		}
		if(unit == '两' && toUnit == '钱'){
			rs = num*10;
		}
		if(unit == '磅' && toUnit == '斤'){
			rs = num*0.90718474;
		}
		if(unit == '磅' && toUnit == '公斤'){
			rs = num*0.45359237;
		}
		if(unit == '公斤' && toUnit == '磅'){
			rs = num*2.20462262;
		}
		if(unit == '盎司' && toUnit == '克'){
			rs = num*28.3495231;
		}

		rs = Math.round(rs*1000)/1000;

		return rs+ '';
	},
	init: function(){
		var _this = this;
		//length
		var $len_con = $('#unitConverter').find('ul.length');
		var $len_rs = $len_con.find('.result'), $len_calc = $len_con.find('.calc');
		var $len_num = $len_con.find('.num'), $len_unit = $len_con.find('.unit'), $len_toUnit = $len_con.find('.toUnit');
		$len_calc.on('touchend',function(){
			var num = $len_num.val(), unit = $len_unit.find(':selected').text(), toUnit = $len_toUnit.find(':selected').text();
			if(!num){return false;}
			var rs = _this.convert(num,unit,toUnit);
			$len_rs.html(rs);

			return false;
		});
		//area
		var $area_con = $('#unitConverter').find('ul.area');
		var $area_rs = $area_con.find('.result'), $area_calc = $area_con.find('.calc');
		var $area_num = $area_con.find('.num'), $area_unit = $area_con.find('.unit'), $area_toUnit = $area_con.find('.toUnit');
		$area_calc.on('touchend',function(){
			var num = $area_num.val(), unit = $area_unit.find(':selected').text(), toUnit = $area_toUnit.find(':selected').text();
			if(!num){return false;}
			var rs = _this.convert(num,unit,toUnit);
			$area_rs.html(rs);

			return false;
		});
		//volume
		var $vol_con = $('#unitConverter').find('ul.vol');
		var $vol_rs = $vol_con.find('.result'), $vol_calc = $vol_con.find('.calc');
		var $vol_num = $vol_con.find('.num'), $vol_unit = $vol_con.find('.unit'), $vol_toUnit = $vol_con.find('.toUnit');
		$vol_calc.on('touchend',function(){
			var num = $vol_num.val(), unit = $vol_unit.find(':selected').text(), toUnit = $vol_toUnit.find(':selected').text();
			if(!num){return false;}
			var rs = _this.convert(num,unit,toUnit);
			$vol_rs.html(rs);

			return false;
		});
		//weight
		var $weight_con = $('#unitConverter').find('ul.weight');
		var $weight_rs = $weight_con.find('.result'), $weight_calc = $weight_con.find('.calc');
		var $weight_num = $weight_con.find('.num'), $weight_unit = $weight_con.find('.unit'), $weight_toUnit = $weight_con.find('.toUnit');
		$weight_calc.on('touchend',function(){
			var num = $weight_num.val(), unit = $weight_unit.find(':selected').text(), toUnit = $weight_toUnit.find(':selected').text();
			if(!num){return false;}
			var rs = _this.convert(num,unit,toUnit);
			$weight_rs.html(rs);

			return false;
		});
		
	}
};


//init
$(function(){
	//weather bootstrap
	$('#menu .weather').on('touchend',function(){
		Weather.init();
	});
	$('#updateWeather').on('touchend',function(){
		var $this = $(this);
		var $loading = $this.next('.loading');
		//loading
		$loading.fadeIn();
		Weather.updateData();

		return false;
	});

	//calculator
	Calculator.init();

	//PM 2.5
	$('#menu .pm25').on('touchend',function(){
		PM25.init();
	});

	//transit
	$('#menu .transit').on('touchend',function(){
		Transit.init();
	});

	//Timer
	Timer.init();

	//Standard Body
	StandardBody.init();

	//scan two-dimension code
	Scanner.init();
	
	//unit converter
	UnitConverter.init();

});


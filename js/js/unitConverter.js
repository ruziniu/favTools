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

$(function(){
	//unit converter
	UnitConverter.init();
});
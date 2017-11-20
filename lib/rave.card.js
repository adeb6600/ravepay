
var chargeCard = require('../services/rave.card.charge');
var validateCharge = require('../services/rave.card.validate');
var chargeCardToken = require('../services/rave.card.tokencharge');
function Card(RaveBase){


	this.charge = function (data) {

		return chargeCard(data, RaveBase);

	}
	this.chargeToken  = function(data){
		return chargeCardToken(data,RaveBase)
	}

	this.validate = function (data) {

		return validateCharge(data, RaveBase);

	}


}
module.exports = Card;
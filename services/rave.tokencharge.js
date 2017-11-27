var morx = require('morx');
var q = require('q');

var spec =  morx.spec()
				.build('currency', 'required:false, eg:NGN')
				.build('country', 'required:false, eg:NG')
				.build('seckey', 'required:true, eg:FLWSECK-4f215bded21389132232dc78fdfb207e-X')
				.build('token', 'required:true, {“user_token”:“f0209”,“embed_token”:“flw-t0-9f3aa69a806f6440fbb78cc9e8b2f135-k3n”}')
				.build('amount', 'required:true, eg:10') 
				.build('email', 'required:true, eg:debowalefaulkner@gmail.com')
				.build('firstname', 'required:false, eg:lawal')
				.build('lastname', 'required:false, eg:garuba')
				.build('IP', 'required:true, eg:127.0.0.1')
				.build('narration', 'required:false, eg:89938910') 
				.build('txRef', 'required:true, eg:443342') 
				.build('meta', 'required:false') 
				.build('device_fingerprint', 'required:false,eg:12233') 
				.end();

function service(data, _rave){

	var d = q.defer();

	q.fcall( () => {

		var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
		var params = validated.params;

		return params;

	})
	.then( params  => {


		if(params.include_integrity_hash){

			delete params.include_integrity_hash;
			var integrity_hash = _rave.getIntegrityHash(params, _rave.getPublicKey(), _rave.getSecretKey());
			params.QUERY_STRING_DATA = JSON.parse(JSON.stringify(params));
			params.QUERY_STRING_DATA.integrity_hash = integrity_hash;

			//console.log(params);
			
			
		}
		console.log(params);
		var encrypted = _rave.encrypt(params);
		var payload = {};
		payload.PBFPubKey = _rave.getPublicKey();
		payload.client = encrypted;
		payload.alg = '3DES-24';
		console.log(payload);
		return _rave.request('flwv3-pug/getpaidx/api/tokenized/charge', payload)
	})
	.then( response => {

		//console.log(response);
		d.resolve(response);

	})
	.catch( err => {

		d.reject(err);

	})

	return d.promise;
	
	

}
service.morxspc = spec;
module.exports = service;

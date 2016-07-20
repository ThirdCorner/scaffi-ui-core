import _ from 'lodash';
import ResponseLogger from './response-logger';
class ErrorLogger {
	constructor(){
		this.listeners = [];
		ResponseLogger.onErrorResponse((event)=>{
			var type = event.type;
			var response = event.response;

			this.fireError("server", response);
			
		})
	}
	fireError(type, error) {
		
		var setError = {};
		if(error instanceof Error) {
			/*
			 So we can stop server calls from continuing
			 */
			if(error.message == "Halt") {
				return true;
			}
			setError = {name: error.name, message: error.message};
			if(error.stack) {
				setError.stack = error.stack.split("\n");
			}
		} else {
			try {
				setError = JSON.parse(JSON.stringify(error));
				if(setError && setError.status){
					setError.statusCode = setError.status;
				}
				
			}catch(e){
				setError = {error: "Couldn't stringify error"};
			}
		}
		
		_.each(this.listeners, (event)=>{
			if(_.isFunction(event)){
				event({type, error});
			}
		}, this);

	}
	
	onError(event){
		this.listeners.push(event);
	}
}

export default new ErrorLogger();
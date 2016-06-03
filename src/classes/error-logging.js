import _ from 'lodash';

class ErrorLogging {
	constructor(){
		this.errors = [];
		this.listeners = [];
	}
	fireError(type, error) {
		this.errors.push({type, error});
		_.each(this.listeners, (event)=>{
			if(_.isFunction(event)){
				event(this.errors);
			}
		}, this);

	}
	clearErrors(){
		this.errors = [];
	}
	onError(event){
		this.listeners.push(event);
	}
}

export default new ErrorLogging();
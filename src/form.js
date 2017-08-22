import {noop} from './utils';

export default class Form{
    /**
     * Pushes error messages to an angular form
     * @param   {object}    $form   the reference of the form
     * @return  {function}
     */
    static pushValidationMessageToForm($form, reject){
        return function(response){
            if($form !== undefined && typeof $form.$setPristine === 'function'){
                if(response.status === 400 && response.data.error){
                    $form.general = {
                        $error : {}
                    };
                    if(typeof response.data.error === 'string'){
                        $form.general.$error.error =
                            Array.isArray(response.data.error) ?
                            response.data.error : [response.data.error];
                    }else{
                        Object.keys($form).forEach(function(key){
                            let value = response.data.error[key];
                            if($form[key] && $form[key].$error){
                                $form[key].$error.error = value;
                            }
                        });
                    }
                }
            }
            return (reject || noop)(response);
        };
    }
}

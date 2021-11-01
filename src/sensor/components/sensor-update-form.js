import React from "react";
import validate from "./validators/sensor-validator";
import {Button} from "react-bootstrap";
import * as API_SENSORS from "../api/sensor-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';

class UpdateSensorForm extends React.Component{
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.okay=0;
        this.formControls = {
            description: {
                value: '',
                placeholder: 'Username:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
            maximumValue: {
                value: '',
                placeholder: 'Name:',
                valid: false,
                touched: false,
                validationRules: {
                    isRequired: true
                }
            },
        }
        this.state = {

            errorStatus: 0,
            error: null,
            formIsValid: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        const sensor = JSON.parse(localStorage.getItem('sensor'));
        if(sensor!=null){
            this.formControls.description.placeholder = sensor.description;
            this.formControls.maximumValue.placeholder = sensor.maximumValue;
        }
    }

    toggleForm(){
        this.setState({collapseForm: !this.state.collapseForm});
    }

    handleChange = event => {
        console.log(this.formControls);
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }
        this.formControls = updatedControls;
        this.setState({
            formIsValid: formIsValid
        });

    };

    updateSensor(id, sensor){
        return API_SENSORS.updateSensor(id, sensor, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully updated sensor with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        const sensor = JSON.parse(localStorage.getItem('sensor'));
        let sensorDescription='';
        let sensorMaximumValue='';
        if(this.formControls.description.value===''){
            sensorDescription = sensor.description;
        }else{
            sensorDescription = this.formControls.description.value;
        }
        if(this.formControls.maximumValue.value===''){
            sensorMaximumValue = sensor.maximumValue;
        }else{
            sensorMaximumValue = this.formControls.maximumValue.value;
        }
        let updateSensor = {
            description: sensorDescription,
            maximumValue: sensorMaximumValue
        };
        this.updateSensor(sensor.id,updateSensor);
    }

    render() {
        return (
            <div>
                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.description.value}
                           touched={this.formControls.description.touched? 1 : 0}
                           valid={this.formControls.description.valid}
                           required
                    />
                    {this.formControls.description.touched && !this.formControls.description.valid &&
                    <div className={"error-message row"}> * Description Required </div>}
                </FormGroup>

                <FormGroup id='maximumValue'>
                    <Label for='maximumValueField'> Maximum Value: </Label>
                    <Input name='maximumValue' id='maximumValueField' placeholder={this.formControls.maximumValue.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.formControls.maximumValue.value}
                           touched={this.formControls.maximumValue.touched? 1 : 0}
                           valid={this.formControls.maximumValue.valid}
                           required
                    />
                    {this.formControls.maximumValue.touched && !this.formControls.maximumValue.valid &&
                    <div className={"error-message"}> * Maximum Value Required</div>}
                </FormGroup>

                <Row>
                    <Col sm={{size: '4', offset: 8}}>
                        <Button type={"submit"} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

                {
                    this.state.errorStatus > 0 &&
                    <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>
                }
            </div>
        ) ;
    }
}

export default UpdateSensorForm;
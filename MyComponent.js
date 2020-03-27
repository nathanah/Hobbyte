import React, {useEffect, useState,Component } from 'react';
import { Platform, StatusBar, StyleSheet, View ,Text} from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import {onCreateMessage} from './src/graphql/subscriptions'; 

export default class MyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        message: "",
        value: "",
        display: false
        };
    }

    async componentDidMount() {
        this.subscription = API.graphql(
        graphqlOperation(onCreateMessage)
        ).subscribe({
        next: event => {
            // console.log(event)
            // if (event){
            console.log("Subscription: " + JSON.stringify(event.value.data, null, 2));
            // this.setState({ display: true });
            // this.setState({ message: event.value.data.onCreateMessage.message });
            //}
        }
        });
    }

   

    render() {
        return (
            <Text>THis is some good text! </Text>
        )
    }
    }
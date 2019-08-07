import React, { Component } from 'react';
import { StyleSheet, Picker, Text, View, Button, TextInput} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import * as d3 from 'd3'
import { ART } from 'react-native'
const { Surface, Group, Shape } = ART

class SignIn extends Component {
  constructor(props){
    super(props)
    this.state = {
      username : 'username',
      password : 'password'
    }

  }
  render(){
    return (
       <View style={{flex: 1, backgroundColor: '#e2e3e2', alignItems: 'center'}}>
        <Text style={{fontSize: 60, color: 'black', paddingTop: -250}}>Budget Buddy</Text>
        <TextInput
          style={styles.TextInputStyle}
          onChangeText={(text) => this.setState({username : text})}
          placeholder={'username'}
          placeholderTextColor={'black'}
        />
        <TextInput
          style={styles.TextInputStyle}
          onChangeText={(text) => this.setState({password : text})}
          placeholder={'password'}
          placeholderTextColor={'black'}
          clearTextOnFocus={true}
        />
        <Button onPress={() => this.props.navigation.navigate('Details', {
          username : this.state.username,
          password : this.state.password
        })} title="Sign in" style={{fontSize: 30}} color="black"/>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      color: ['blue', 'red', 'green', 'yellow', 'orange', 'white', 'black'],
      userPurchases : [      
      {
        itemName: 'Mountain Dew',
        price: 3
      },
      {
        itemName: 'Shoes',
        price: 50
      },
      {
        itemName: 'Kit Kat',
        price: 1
      },
      {
        itemName: 'Taxi',
        price: 24
      },
      {
        itemName: 'Watch',
        price: 100
      },
      {
        itemName: 'Headphones',
        price: 15
      },
      {
        itemName: 'Wine',
        price: 16
      }]
    }
    this.getColor = this.getColor.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  getColor = (index) => {
    return this.state.color[index];
  }

  updateCategories = (obj) => {
    let arr = this.state.userPurchases;
    let inArr = false;
    for(let i = 0; i < arr.length; i++){
      if(arr[i].itemName === obj.itemName){
        inArr = true;
      }
    }
    if(!inArr && obj.itemName){
      arr.push(obj);
      this.setState({userPurchases : arr});
    }
  }

  updateValue = (name, value) => {
    let index = 0;
    let arr = this.state.userPurchases;
    for(let i = 0; i < arr.length; i++){
      if(arr[i].itemName === name){
        index = i;
        break;
      }
    }
    let newVal = Number(value) + Number(arr[index].price)
    arr[index].price = newVal;
    this.setState({userPurchases : arr})
  }

  componentDidMount(props) {
    const { navigation } = this.props;
    this.setState({
      username : navigation.getParam('username', 'username'),
      password : navigation.getParam('password', 'password')
    })
  }

  render() {
    const width = 450
    const height = 450
    const sectionAngles = d3.pie().value(d => d.price)(this.state.userPurchases)
    const path = d3.arc().outerRadius(150).padAngle(.05).innerRadius(100)
    return (
      <View style={{flex: 1, backgroundColor: '#e2e3e2', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Expense Ratio {this.state.username}</Text>
        <Surface width={width} height={height}>
          <Group x={width/2} y={height/2}>
          {
            sectionAngles.map((section, index) => (
              <Shape
                key={section.index}
                d={path(section)}
                stroke="#000"
                fill={this.getColor(index)}
                strokeWidth={1}
              />
            ))
          }  
          </Group>
        </Surface>
        <Button onPress={() => this.props.navigation.navigate('Add',  {
          current : this.state.userPurchases,
          change : this.updateCategories,
          value : this.updateValue
        })} title="Add Expenses" style={{fontSize: 30}} color="black"/>
        <Button onPress={() => this.props.navigation.navigate('Remove')} title="Remove Expenses" style={{fontSize: 30}} color="black"/>
        <Button onPress={() => this.props.navigation.navigate('Settings')} title="Settings" style={{fontSize: 30}} color="black"/>
      </View>
    );
  }
}

class Add extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      current : [],
      change : x => x,
      
    }
  }

  componentDidMount(props) {
    const { navigation } = this.props;
    this.setState({
      current : navigation.getParam('current'),
      change : navigation.getParam('change'),
      changeVal : navigation.getParam('value'),
      expense : '',
      newCategory : '',
      value: 0
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e2e3e2', justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          style={styles.TextInputStyle}
          onChangeText={(text) => this.setState({newCategory : text})}
          placeholder={'add a category'}
          placeholderTextColor={'black'}
        />
        <Button onPress={() => {
          this.state.change({itemName : this.state.newCategory, price : 0});
          this.forceUpdate()
          }} title="Add Category" style={{fontSize: 30}} color="black"/>
        <Picker
          selectedValue={this.state.expense}
          style={{height: 50, width: 400}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({expense: itemValue})
          }>
          {this.state.current.map((expense, key) => (
            <Picker.Item key={key} label={expense.itemName} value={expense.itemName} />
          ))}
        </Picker>
        <TextInput proptype='number'
          style={styles.TextInputStyle}
          onChangeText={(text) => this.setState({value : text})}
          placeholder={'please enter expense amount'}
          placeholderTextColor={'black'}
          keyboardType={'numeric'}
        />
        <Button onPress={() => {
          this.state.changeVal(this.state.expense, this.state.value);
          this.forceUpdate()
          }} title="Add Expense" style={{fontSize: 30}} color="black"/>
        {this.state.current.map((expense, key) => (
          <Text key={key}>
            {expense.itemName} {expense.price}
          </Text>
        ))}
      </View>
    );
  }
}

class Remove extends React.Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e2e3e2', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Remove Screen</Text>
      </View>
    );
  }
}

class Settings extends React.Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e2e3e2', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: SignIn,
    Details: DetailsScreen,
    Add: Add,
    Remove: Remove,
    Settings: Settings
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
},  
  headerText: {  
    fontSize: 20,  
    textAlign: "center",  
    margin: 10,  
    fontWeight: "bold"  
},  
TextInputStyle: {  
    textAlign: 'center',  
    height: 40,  
    borderRadius: 10,  
    borderWidth: 2,  
    borderColor: '#009688',  
    marginBottom: 10,  
    width: 300
}  
});

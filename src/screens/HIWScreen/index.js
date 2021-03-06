import React from 'react';
import * as RNIap from 'react-native-iap';
import Constant from "../../config/constants"
import {Platform} from 'react-native';

import {
  ScrollView,
  View,
  Image,
  Text,
  WebView,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';
import styles from './style';
import Header from '../../components/Header';
import colors from '../../config/colors';
import {connect} from 'react-redux';
import {howItWorks} from '../../actions/howItWorks';
import HTML from 'react-native-render-html';
import constants from '../../config/constants';
import {validateEbook} from '../../actions/book';
// import axios from "axios";

class HIWScreen extends React.Component {
  state = {
    data: ' -- ',
  };


  async componentDidMount() {


    const itemSkus = Platform.select({
      ios: [
        'org.reactjs.native.example.SynergisticGolf.ebook'
      ],
      android: [
        'com.example.coins100'
      ]
    });


    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({ products });
      console.log({products})
    } catch(err) {
      console.log(err); // standardized err.code and err.message available
    }
  }


  async componentWillMount () {
    this.props.howItWorks();


// try {
  
//   await RNIap.prepare();
//   const products = await RNIap.getProducts(itemSkus);
//   this.setState({ items });
//   console.log({products})
// } catch(err) {
//   console.warn(err);
// }
  };




  componentWillReceiveProps(nextProps) {
    console.log({nextProps})
    if (nextProps.contentIs.status) {
      this.setState({data: nextProps.contentIs.data.content});
    }
  }

  //on Buy Booke press
  onBuyPress = () => {
    this.props.navigation.navigate('ShippingDeatils');
  };

  //on Ebook press
  onEbookPress = () => {

 
    // RNIap.requestPurchase('org.reactjs.native.example.SynergisticGolf.ebook').then(purchase => {
    //   console.log({purchase})
    //   this.setState({
    //    receipt: purchase.transactionReceipt
    //   });
    //   let test = purchase.transactionReceipt;
    //   Alert.alert(`Success!! - ${test}`)
    //   axios.post()
    //  // handle success of purchase product
    //  }).catch((error) => {
    //    Alert.alert(`${error}`)
    //   console.log(error.message);
    //  })

  

    AsyncStorage.getItem(constants.USER_ID).then(value => {
      let data = {accessToken: value};
      this.props.validateEbook(data).then(async res => {
        const dataAsString = await new Response(res._bodyInit).text();
        const obj = JSON.parse(dataAsString);
        if (obj.status) {
          this.props.navigation.navigate('Ebook', {
            url: 'http://18.219.46.56/server/images/uploads/SYNERGISTIC-GOLF.pdf',
          });
        } else {

          if(Platform.OS === 'ios'){
          RNIap.requestPurchase('org.reactjs.native.example.SynergisticGolf.ebook').then(purchase => {
            console.log({purchase})
            this.setState({
             receipt: purchase.transactionReceipt
            });
            let test = purchase.transactionReceipt;
            let postUrl = constants.API_BASE_URL + "ebook/inapp"

            fetch(postUrl, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reciept: this.state.receipt, userId: value 
              }),
            }).then(async res => {
              const dataAsString = await new Response(res._bodyInit).text();
              const obj = JSON.parse(dataAsString);
            if(obj.status){

              Alert.alert(`Transaction Successful`)
            } else {
              Alert.alert(`${obj.message}`)
              console.log(obj);

            }
            })


            

           // handle success of purchase product
           }).catch((error) => {
             Alert.alert(`${error}`)
            console.log(error.message);
           })
          } else if(Platform.OS === 'android'){
       
           AsyncStorage.getItem(constants.USER_ID).then(value => {

             this.props.navigation.navigate('Payment', {
               type: 'ebook',
               amount: "19",
              user:value
             });
           })
         }}


        
        

        
      });
    });
  };

  render() {
    var htmlCode = '<b>I am rendered in a <i>WebView</i></b>';

    return (
      <ScrollView style={styles.container}>
        <Header
          screenName={'How it works'}
          backIcon={true}
          navigator={this.props.navigation}
        />
        <View style={styles.innerView}>
          <Text style={styles.title}>HOW THIS APP WILL HELP YOU</Text>
          <HTML html={this.state.data} />
        </View>
        <View style={styles.containerContent}>
          <View>
            <Image
              style={styles.image}
              source={require('../../assets/images/synergisticgolfFrontCover.jpg')}
            />
            <Image
              style={styles.image}
              source={require('../../assets/images/synergisticgolfCover.jpg')}
            />
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={this.onEbookPress}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Ebook</Text>
                <Text style={[styles.buttonText, {marginLeft: 5}]}>$19</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '50%'}} onPress={this.onBuyPress}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Book</Text>
                <Text style={[styles.buttonText, {marginLeft: 5}]}>$29</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    contentIs: state.howItWorks,
  };
};

export default connect(
  mapStateToProps,
  {howItWorks, validateEbook},
)(HIWScreen);

import React from 'react';
import {
  AsyncStorage,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Snackbar from 'react-native-snackbar';
import {connect} from 'react-redux';
import Spinner from 'react-native-spinkit';
import colors from '../../config/colors';
import settings from '../../config/settings';
import constants from '../../config/constants';
import Settings from '../../config/settings';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import {Platform} from 'react-native';

import {
  addCardSubscription,
  addPaypalSubscription,
  addPaypalSubscriptionEbook,
  addPaypalSubscriptionWorkout
} from '../../actions/transaction';
import {validatePromocode} from '../../actions/workout';
import styles from './style';

class PaymentScreen extends React.Component {
  state = {
    name: '',
    cardNumber: '',
    cvv: '',
    month: '',
    year: '',
    modalVisible: false,
    code: '',
  };

  
  
  //seting name in setState
  setNameOnCard = text => {
    this.setState({name: text});
  };
  
  //seting card number in setState
  setCardNumber = text => {
    this.setState({cardNumber: text});
  };
  
  //seting card cvv in setState
  setCardCvv = text => {
    this.setState({cvv: text});
  };
  
  //seting card expiry month in setState
  setExpiryMonth = text => {
    this.setState({month: text});
  };
  
  //seting card expiry year in setState
  setExpiryYear = text => {
    this.setState({year: text});
  };
  
  // modal visibility
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  
  //seting Promocode in setState
  setPromocode = text => {
    this.setState({code: text});
  };
  
  //on Paypal Pressed
  onPaypalPressed = () => {
    const {navigation} = this.props;
    const id = navigation.getParam('id');
    const amount = navigation.getParam('amount');
    const shippingId = navigation.getParam('shippingId');
    const type = navigation.getParam('type');

    this.setState({paypalClick: true});
    if(type === "ebook") {
      AsyncStorage.getItem(constants.USER_ID).then(value => {
        const data = {id: value, amount: amount};
      // data.accessToken = value;
      this.props.addPaypalSubscriptionEbook(data).then(async res => {
        this.setState({paypalClick: false});
        const dataAsString = await new Response(res._bodyInit).text();
        const obj = JSON.parse(dataAsString);
        console.log({obj})
        if (obj.success) {
          this.props.navigation.navigate('Paypal', {
            url: obj.url,
          });
        } else {
          Snackbar.show({
            title: obj.error.description,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
    });
      
    } else if(type === "workout"){
      console.log("inside workout")
      AsyncStorage.getItem(constants.USER_ID).then(value => {
        const videoId = navigation.getParam('videoId');

        const data = {id: value, amount: amount, videoId };
       
                
      // data.accessToken = value;
      this.props.addPaypalSubscriptionWorkout(data).then(async res => {
        this.setState({paypalClick: false});
        const dataAsString = await new Response(res._bodyInit).text();
        const obj = JSON.parse(dataAsString);
        console.log({obj})
        if (obj.success) {
          this.props.navigation.navigate('Paypal', {
            url: obj.url,
          });
        } else {
          Snackbar.show({
            title: obj.error.description,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
    });
    } else if(type !== "ebook"){
      const data = {id: id, amount: amount, shippingId: shippingId};
    AsyncStorage.getItem(constants.ACCESSTOKEN_NAME).then(value => {
      data.accessToken = value;
      this.props.addPaypalSubscription(data).then(async res => {
        this.setState({paypalClick: false});
        const dataAsString = await new Response(res._bodyInit).text();
        const obj = JSON.parse(dataAsString);
        console.log({obj})
        if (obj.success) {
          this.props.navigation.navigate('Paypal', {
            url: obj.url,
          });
        } else {
          Snackbar.show({
            title: obj.error.description,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      });
    });} 
  };
  
  //on Vip press
  onVipPress = () => {
    const {code} = this.state;
    const {navigation} = this.props;
    const id = navigation.getParam('id');
    const url = navigation.getParam('url');
    if (code.trim().length === 0) {
      Snackbar.show({
        title: constants.EMPTY_PROMOCODE,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      AsyncStorage.getItem(constants.ACCESSTOKEN_NAME).then(value => {
        let data = {accessToken: value, code: code, id: id};
        this.props.validatePromocode(data).then(async res => {
          const dataAsString = await new Response(res._bodyInit).text();
          const obj = JSON.parse(dataAsString);
          if (obj.success) {
            Alert.alert(
              code,
              obj.response,
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
              );
              this.setState({
                modalVisible: false,
              });
              this.props.navigation.navigate('WorkoutView', {
                url: url,
              });
            } else {
              Snackbar.show({
                title: obj.error.description,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          });
        });
    }
  };

  //on submit pressed
  onSubmitPressed = () => {
    Keyboard.dismiss(); // dismissing keyboard
    const {navigation} = this.props;
    const url = navigation.getParam('url');
    const id = navigation.getParam('id');
    const amount = navigation.getParam('amount');
    const shippingId = navigation.getParam('shippingId');
    const userId = navigation.getParam('user');
    const type = navigation.getParam('type');
    const videoId = navigation.getParam('videoId');

    const {name, cardNumber, cvv, month, year} = this.state;
    const data = {
      isLoading: false,
      name: name,
      cardNumber: cardNumber,
      cvv: cvv,
      month: month,
      year: year,
      id: id,
      amount: amount,
      shippingId: shippingId,
      userId,
      type,
      videoId
    };
    if(type === "ebook"){
      data.ebook = true
    }
    if (cardNumber.trim().length === 0) {
      Snackbar.show({
        title: constants.EMPTY_CARD_NUMBER,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (cardNumber.trim().length < 14) {
      Snackbar.show({
        title: constants.VALID_CARD_NUMBER,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (cvv.trim().length === 0) {
      Snackbar.show({
        title: constants.EMPTY_CVV,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (cvv.trim().length < 3) {
      Snackbar.show({
        title: constants.VALID_CVV,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (month.trim().length === 0) {
      Snackbar.show({
        title: constants.EMPTY_EXPIRY_MONTH,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (parseInt(month) > 12) {
      Snackbar.show({
        title: constants.VALID_EXPIRY,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (
      parseInt(year) == new Date().getFullYear() &&
      parseInt(month) < new Date().getMonth()
      ) {
        Snackbar.show({
          title: constants.VALID_EXPIRY,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (year.trim().length === 0) {
        Snackbar.show({
          title: constants.EMPTY_EXPIRY_YEAR,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (year < new Date().getFullYear()) {
        Snackbar.show({
          title: constants.VALID_EXPIRY,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        this.setState({isLoading: true});
        AsyncStorage.getItem(constants.ACCESSTOKEN_NAME).then(value => {
          data.accessToken = value;
          this.props.addCardSubscription(data).then(async res => {
            const dataAsString = await new Response(res._bodyInit).text();
            const obj = JSON.parse(dataAsString);
            this.setState({isLoading: false});
            console.log({obj})
            if (obj.status) {
              console.log({obj})
              Snackbar.show({
                title: obj.message,
                duration: Snackbar.LENGTH_SHORT,
              });
              if(type === "ebook"){
                this.props.navigation.navigate('Ebook', {
                  url: url,
                });
              } else if(type === "workout"){
                this.props.navigation.navigate('WorkoutView', {
                  url: url,
                });
              } else {
                this.props.navigation.navigate('Workout', {
                  url: url,
                });
              }
             
            } else {
              Snackbar.show({
                title: obj.message,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          });
        });
      }
    };
    
    render() {
      console.log("inside payment screen")
      console.log(this.props)
      const {navigation} = this.props;
      const type = navigation.getParam('type');
      const shippingId = navigation.getParam('shippingId');
      const amount = navigation.getParam('amount');
      return (
        <KeyboardAvoidingView style={styles.container}>
        <Header
          screenName={'Payment'}
          navigator={this.props.navigation}
          submitIcon={false}
          backIcon={true}
        />
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: settings.paddingOfAuthPages,
            }}>
            <Text style={{color: 'grey'}}>Please pay ${amount}</Text>
            <TouchableOpacity onPress={() => this.onPaypalPressed()}>
              {!this.state.paypalClick ? (
                <Image
                  style={{height: 50, width: 250}}
                  source={require('../../assets/images/paypal.png')}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: '#3b7bbf',
                    height: 50,
                    width: 250,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Spinner
                    isVisible={this.state.isLoading}
                    size={50}
                    type="ThreeBounce"
                    color={colors.secondaryColor}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPressOut={() => {
                    this.setModalVisible(false);
                  }}>
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                      <View
                        style={{
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '40%',
                          width: '100%',
                        }}>
                        <View style={styles.modalSection}>
                          <TextInput
                            keyboardType="email-address"
                            editable={true}
                            placeholderTextColor="grey"
                            placeholder="Enter a promocode"
                            style={styles.input}
                            autoCapitalize="none"
                            underlineColorAndroid="transparent"
                            onChangeText={text => this.setPromocode(text)}
                          />
                        </View>
                        <View style={{width: '100%', paddingHorizontal: 10}}>
                          <CustomButton
                            title={'Apply'}
                            onPress={this.onVipPress}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
            <Text style={{color: 'red', marginTop: 10, marginBottom: 10}}>
              OR
            </Text>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name={'credit-card'} size={18} />
              <TextInput
                keyboardType="email-address"
                editable={true}
                maxLength={40}
                placeholderTextColor="grey"
                placeholder="Name On Card"
                style={styles.input}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                onChangeText={text => this.setNameOnCard(text)}
              />
            </View>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name={'credit-card'} size={18} />
              <TextInput
                keyboardType="numeric"
                editable={true}
                maxLength={16}
                placeholderTextColor="grey"
                placeholder="Card Number"
                style={styles.input}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                onChangeText={text => this.setCardNumber(text)}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.secondaryColor,
                  borderWidth: 0.5,
                  borderRightWidth: 0,
                  borderColor: colors.defaultColor,
                  marginVertical: 5,
                  width: '50%',
                }}>
                <Icon
                  style={styles.searchIcon}
                  name={'credit-card'}
                  size={18}
                />
                <TextInput
                  keyboardType="numeric"
                  secureTextEntry={true}
                  editable={true}
                  maxLength={4}
                  placeholderTextColor="grey"
                  placeholder="Cvv"
                  style={styles.input}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setCardCvv(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.secondaryColor,
                  borderWidth: 0.5,
                  borderColor: colors.defaultColor,
                  marginVertical: 5,
                  width: '50%',
                }}>
                <TextInput
                  keyboardType="numeric"
                  editable={true}
                  maxLength={2}
                  placeholderTextColor="grey"
                  placeholder="MM"
                  style={{
                    textAlign: 'right',
                    width: '25%',
                    height: 44,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                  }}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setExpiryMonth(text)}
                />
                <Text>/</Text>
                <TextInput
                  keyboardType="numeric"
                  editable={true}
                  maxLength={4}
                  placeholderTextColor="grey"
                  placeholder="YYYY"
                  style={{
                    height: 44,
                    width: '50%',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setExpiryYear(text)}
                />
              </View>
            </View>
            {!this.state.isLoading ? (
              <CustomButton title={'Submit'} onPress={this.onSubmitPressed} />
            ) : (
              <View
                style={{
                  backgroundColor: colors.defaultColor,
                  height: 40,
                  width: '100%',
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Spinner
                  isVisible={this.state.isLoading}
                  size={50}
                  type="ThreeBounce"
                  color={colors.secondaryColor}
                />
              </View>
            )}
            {!type && type != 'ebook' && (
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(true);
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{color: colors.defaultColor, marginVertical: 10}}>
                    Have a promocode?
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  null,
  {addCardSubscription, addPaypalSubscription, addPaypalSubscriptionEbook, addPaypalSubscriptionWorkout,validatePromocode},
)(PaymentScreen);

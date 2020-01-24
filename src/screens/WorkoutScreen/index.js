import React from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as RNIap from 'react-native-iap';

import Snackbar from 'react-native-snackbar';
import styles from './style';
import constants from '../../config/constants';
import Header from '../../components/Header';
import ListItem from '../../components/ListItem';
import {connect} from 'react-redux';
import {
  getWorkouts,
  validateWorkout,
  validateAllWorkout,
  validatePromocode,
} from '../../actions/workout';
import {validateEbook} from '../../actions/book';
import Constants from '../../config/constants';

class WorkoutScreen extends React.Component {
  async componentDidMount() {
    this.props.getWorkouts();

    const itemSkus = Platform.select({
      ios: ['org.reactjs.native.example.SynergisticGolf.workout'],
      android: ['com.example.coins100'],
    });

    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({products});
      console.log({products});
    } catch (err) {
      console.log(err); // standardized err.code and err.message available
    }
  }

  //on download all press
  onDownloadAllWorkoutsPress = () => {
    AsyncStorage.getItem(constants.ACCESSTOKEN_NAME).then(value => {
      let data = {accessToken: value};
      this.props
        .validateAllWorkout(data)
        .then(async res => {
          const dataAsString = await new Response(res._bodyInit).text();
          const obj = JSON.parse(dataAsString);
          if (obj.success) {
            Snackbar.show({
              title: 'you have already paid for all workuts',
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            if (obj.response.amount > 0) {
              this.props.navigation.navigate('Payment', {
                id: 'all',
                amount: obj.response.amount,
              });
            } else {
              Snackbar.show({
                title: obj.error.description,
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        })
        .catch(error => console.log('Download All Workout Error:', error));
    });
  };

  //on Buy Booke press
  onBuyPress = () => {
    this.props.navigation.navigate('ShippingDeatils');
  };


  //Old developer code
  //on Ebook press
  // onEbookPress = () => {
  //   AsyncStorage.getItem(constants.ACCESSTOKEN_NAME).then(value => {
  //     let data = {accessToken: value};
  //     this.props.validateEbook(data).then(async res => {
  //       const dataAsString = await new Response(res._bodyInit).text();
  //       const obj = JSON.parse(dataAsString);
  //       if (obj.status) {
  //         this.props.navigation.navigate('Ebook', {
  //           url: 'http://18.217.138.86/SYNERGISTIC-GOLF.pdf',
  //         });
  //       } else {
  //         this.props.navigation.navigate('Payment', {
  //           type: 'ebook',
  //           amount: obj.response.amount,
  //         });
  //       }
  //     });
  //   });
  // };

//on Ebook press
onEbookPress = () => {

 
 

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


        RNIap.requestPurchase('org.reactjs.native.example.SynergisticGolf.ebook').then(purchase => {
          console.log({purchase})
          this.setState({
           receipt: purchase.transactionReceipt
          });
          let test = purchase.transactionReceipt;
          let postUrl = Constants.API_BASE_URL + "ebook/inapp"

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

      
      }
    });
  });
};


  //on video press
  onVideoPress = item => {
    if(!item.isPaid){
      this.props.navigation.navigate('WorkoutView', {
        url: item.url,
      });
    } else {
    AsyncStorage.getItem(constants.USER_ID).then(value => {
      let data = {userId: value, videoId: item._id};
      this.props.validateWorkout(data).then(async res => {
        const dataAsString = await new Response(res._bodyInit).text();
        const obj = JSON.parse(dataAsString);
        console.log({obj})
        if (obj.status) {
          this.props.navigation.navigate('WorkoutView', {
            url: item.url,
          });
        } else {
          // this.props.navigation.navigate('Payment', {
          //   url: item.url,
          //   id: item.id,
          //   amount: obj.response.amount,
          // });

          RNIap.requestPurchase(
            'org.reactjs.native.example.SynergisticGolf.workout',
          )
            .then(purchase => {
              console.log({purchase});
              this.setState({
                receipt: purchase.transactionReceipt,
              });
              fetch(Constants.API_BASE_URL + 'workout/subscribe', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: value,
                  videoId: item._id,
                  receipt: this.state.receipt,
                }),
              })
                .then(response => response.json())
                .then(responseData => {
                  if (responseData.status) {
                    Alert.alert('Transaction Successful!');
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              Alert.alert(`${error}`);
              console.log(error.message);
            });
        }
      });
    });}
  };

  _keyExtractor = (item, index) => item.id;

  render() {
    let {workouts} = this.props;
    console.log({workouts});
    console.log(workouts.length);
    return (
      <ScrollView>
        <Header
          screenName={'Workouts'}
          navigator={this.props.navigation}
          submitIcon={false}
          backIcon={true}
          // downloadAll={true}
          // onDownloadAllWorkoutsPress={this.onDownloadAllWorkoutsPress}
        />
        <View style={styles.container}>
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
            <TouchableOpacity style={{width: '50%'}} onPress={this.onEbookPress}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Ebook</Text>
                <Text style={[styles.buttonText, {marginLeft: 5}]}>$19</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '50%'}} onPress={this.onBuyPress}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>View Book</Text>
                <Text style={[styles.buttonText, {marginLeft: 5}]}>$29</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {workouts.length > 0 ? (
          <FlatList
            data={workouts}
            renderItem={({item}) => (
              <ListItem item={item} onVideoPress={this.onVideoPress} />
            )}
            ListFooterComponent={<View style={{height: 50}} />}
          />
        ) : (
          <View style={{width: '100%', height: 500}}>
            <ActivityIndicator
              color="#000"
              size="large"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    workouts: state.workout.data,
  };
};

export default connect(mapStateToProps, {
  getWorkouts,
  validateWorkout,
  validateAllWorkout,
  validatePromocode,
  validateEbook,
})(WorkoutScreen);

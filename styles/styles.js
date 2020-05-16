import { StyleSheet, Dimensions } from 'react-native'
const {width:WIDTH} = Dimensions.get('window')

const styles = StyleSheet.create({
    container:{
        padding:20,
    },

    formBox:{
        height: 45,
        backgroundColor: '#19b7bf',
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(0,0,0,0.35)',
        color: 'rgba(255,255,255,0.7)',
        marginHorizontal: 25,
        marginBottom: 15,
        paddingHorizontal: 20,
        fontFamily:'space-mono',


    },
    btnEye:{
      position: 'absolute',
      top: 10,
      right:37,

    },
    sidebuttoncontainer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
    },
    //backgroundVideo: {
    //  ...StyleSheet.absoluteFillObject,
    //},
    ButtonContainer:{

        //padding: 10,
        //paddingBottom: 45,

    },
    backgroundContainer:{
      flex:1,
      width:null,
      height:null,
      justifyContent: 'center',
      alignItems:'center',
    },
    texts:{

      textAlign:'center',
        color:'#FFF',
        fontWeight: "600",
        fontFamily:'space-mono',

        backgroundColor:'#19b7bf',
        // borderRadius:20,
        // borderWidth: 1,
        padding:10,
        borderRadius: 25,
        fontSize: 16,
        marginHorizontal: 85,
        marginBottom: 15,
        paddingHorizontal: 20,
        fontFamily:'space-mono',
        textDecorationLine: 'underline',
    },

  header:{
    paddingBottom: 25,
    fontSize: 18,
  },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: "600",
        fontFamily:'space-mono',

        backgroundColor:'#db8a75',
        // borderRadius:20,
        // borderWidth: 1,
        padding:10,
        borderRadius: 25,
        fontSize: 16,
        marginHorizontal: 85,
        marginBottom: 15,
        paddingHorizontal: 20,
        fontFamily:'space-mono',


    },
    signoutbuttonText:{
      height: 45,
      backgroundColor: '#19b7bf',
      borderRadius: 25,
      fontSize: 16,
      paddingLeft: 45,
      backgroundColor: 'rgba(0,0,0,0.35)',
      color: 'rgba(255,255,255,0.7)',
      padding:10,
      borderRadius: 25,
      fontSize: 16,
      marginHorizontal: 25,
      marginBottom: 15,
      paddingHorizontal: 20,
      fontFamily:'space-mono',


  },
  



    resetbuttonText:{
      textAlign:'center',
      color:'#FFF',
      fontWeight: "600",
      fontFamily:'space-mono',

      backgroundColor:'#32CD32',
      // borderRadius:20,
      // borderWidth: 1,
      padding:10,
      borderRadius: 25,
      fontSize: 16,
      marginHorizontal: 85,
      marginBottom: 15,
      paddingHorizontal: 20,
      fontFamily:'space-mono',


  },
    inputIcon:{
      position: 'absolute',
      top: 10,
      left:37,

    },
    buttonIcon:{

      position: 'absolute',
      top: 10,
      left:37,

    },
    title:{
      paddingTop:20,
      fontSize:15,
      fontSize: 20,
      //fontWeight: "bold",
      fontFamily:'space-mono',
      textAlign:'center',
      color:'#FFF'
    },

    logo: {
      alignSelf: 'center',
      height: 200,
      width: 200,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',


    },
    user_footer:{
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        height: 45,
        marginLeft: 10,
        marginRight:50,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    },
    add_user: {
      paddingTop: 10,
      marginLeft: 10,
      paddingHorizontal: 10,
      fontSize: 20,
      marginBottom: 10,
    },
    add_user_button: {
      height: 45,
      marginLeft: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    add_user_text: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      fontSize: 20,
      color:'#FFF',
      backgroundColor:'#db8a75',
    },
    list_user: {
      height: 45,
      backgroundColor: '#F0F0F0',
      marginLeft: 10,
      marginRight:50,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    delete: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 75,
        backgroundColor: 'red',
        color: '#FFF',
        bottom: 0,
        top: 0,
        right: 0,
        marginBottom: 15,
        marginRight:50,
    },
    list_user_text: {
      marginLeft: 20,
      marginTop:10,
      fontSize: 20,
    }

  })

  export {styles}

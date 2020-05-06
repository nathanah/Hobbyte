import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container:{
        padding:20,
    },

    formBox:{
        height: 45,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1

    },

    //backgroundVideo: {
    //  ...StyleSheet.absoluteFillObject,
    //},
    ButtonContainer:{

        padding: 10,

    },

    resetContainer:{

      paddingVertical: 5,
      backgroundColor: '#728C69',
  },
  header:{
    paddingBottom: 25,
    fontSize: 18,
  },
    buttonText:{
        textAlign:'center',
        color:'#FFF',
        fontWeight: "600",
        backgroundColor:'#db8a75',
        // borderRadius:20,
        // borderWidth: 1,
        padding:10


    },

    title:{
      paddingTop:20,
      textAlign:'center',
      color:'#000'
    },

    logo: {
      alignSelf: 'center',
      height: 200,
      width: 200,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',


    },
    formBox:{
        height: 45,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    },
    add_user: {
      paddingHorizontal: 10,
      height: 45,
      fontSize: 20,
      backgroundColor: '#F0F0F0',
      marginLeft: 10,
      marginRight:50,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    add_user_button: {
      height: 45,
      backgroundColor: '#F0F0F0',
      marginLeft: 10,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    add_user_text: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop:10,
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

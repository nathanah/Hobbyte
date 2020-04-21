import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container:{
        padding:20,
    },
  
    formBox:{
        height: 45,
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1
  
    },
  
    //backgroundVideo: {
    //  ...StyleSheet.absoluteFillObject,
    //},
    ButtonContainer:{
  
        paddingVertical: 10,
  
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
      
       
      }
  
  })

  export {styles}
  
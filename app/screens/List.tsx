import {View,Text,Button,StyleSheet,TextInput} from "react-native";
import React, {useEffect, useState} from "react";
import {addDoc,collection,onSnapshot} from 'firebase/firestore'
import {FIREBASE_DB} from "../../firebaseConfig";
const List = ({navigation}:any) =>{
    const [todos,setTodos] = useState<any[]>([]);
    const [todo,setTodo] = useState('');

    useEffect(()=>{
        const todoRef = collection(FIREBASE_DB,'todos');

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                console.log('Updated✅')
                const todos: any[] = [];
                snapshot.docs.forEach(doc => {
                    console.log(doc.data())
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                setTodos(todos)
            }
        })

        return ()=>subscriber();
    },[])

    const addTodo = async()=>{
        const doc = await addDoc(collection(FIREBASE_DB,'todos'),{title:todo,done:false})
        console.log("🚀 ~ file: List.tsx:12 ~ addTodo ~ doc:",doc)
        setTodo('')
    }
    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder='Add new todo'
                           onChangeText={(text:string)=> setTodo(text)}
                           value={todo}
                />
                <Button onPress={addTodo} title="Add Todo" disabled={todo === ''}/>
            </View>
            <View>
                {todos.map(todoItem => (
                    <Text key={todoItem.id}>{todoItem.title}</Text>
                ))}
            </View>

        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 20,

    },
    form:{
        marginVertical:20,
        flexDirection: "row",
        alignItems:"center"
    },
    input:{
        flex:1,
        height:40,
        borderWidth:1,
        borderRadius:4,
        padding:10,
        backgroundColor:"#fff"
    }
})

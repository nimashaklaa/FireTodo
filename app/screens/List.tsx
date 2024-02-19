import { View, Text, Button, StyleSheet, TextInput,FlatList,TouchableOpacity} from "react-native";
import React, { useEffect, useState } from "react";
import { doc,addDoc, collection, onSnapshot,updateDoc,deleteDoc} from 'firebase/firestore';
import { FIREBASE_DB } from "../../firebaseConfig";
import {Ionicons,Entypo} from '@expo/vector-icons';


export interface Todo{
    title: string;
    done: boolean;
    id: string
}
const List = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('');

    useEffect(()=>{
        const todoRef = collection(FIREBASE_DB,'todos');

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                //console.log('Updated✅')
                const todos: any[] = [];
                snapshot.docs.forEach(doc => {
                    console.log(doc.data())
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    }as Todo)

                });
                setTodos(todos)
            }
        })

        return ()=>subscriber();
    },[])

    const addTodo = async () => {
        try {
            const doc = await addDoc(collection(FIREBASE_DB, 'todos'), { title: todo, done: false });
            console.log("🚀 ~ file: List.tsx:12 ~ addTodo ~ doc:", doc);
            setTodo('');
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const renderTodo = ({item}:any)=>{
        const ref = doc(FIREBASE_DB,`todos/${item.id}`)
        const toggleDone = async()=>{
            await updateDoc(ref,{done:!item.done})
        }
        const deleteItem = async()=>{
            await deleteDoc(ref)
        }
        return(
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done && <Ionicons name='checkmark-circle' size={24} color='green' /> }
                    {!item.done && <Entypo name='circle' size={24} color='black'/> }
                    <Text style={styles.todoText}>{item.title}</Text>
                </TouchableOpacity>
                <Ionicons name='trash-bin-outline' size={24} color="red" onPress={deleteItem}/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new todo'
                    onChangeText={(text: string) => setTodo(text)}
                    value={todo}
                />
                <Button onPress={addTodo} title="Add Todo" disabled={todo === ''} />
            </View>
            <View>
                {todos.length>0 && (
                    <View>
                        <FlatList
                        data={todos}
                        renderItem={renderTodo}
                        keyExtractor={(todo)=>todo.id}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        padding:5
    },
    form: {
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff"
    },
    todoContainer:{
        flexDirection: "row",
        alignItems:"center",
        backgroundColor:"#fff",
        padding: 10,
        marginVertical:5,
    },
    todoText:{
        flex:1,
        paddingHorizontal:10,
    },
    todo:{
        flex:1,
        flexDirection: "row",
        alignItems:"center",

    }
});

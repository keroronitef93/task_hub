<template>
  <div>
    <Header></Header>
    <form v-on:submit.prevent="addTask" class="border rounded mt-5 mb-4 mx-5">
        <div class="form-group">
            <h3 class="mt-2">タスクを追加する</h3>
            <div class="col-md-4">
                <input type="text" v-model="newTask" placeholder="タスクを入力" class="form-control border border-danger mt-4">
                <textarea type="text" v-model="newComment" placeholder="メモを入力" class="form-control border border-danger mt-4"></textarea>
            </div>
            <div class="m-3">
                <input type="radio" v-model="newProgress" value="未完了" class="form-check-input">
                <label class="me-3">未完了</label>
                <input type="radio" v-model="newProgress" value="完了" class="form-check-input">
                <label class="me-3">完了</label> 
            </div>
            <button type="submit" class="btn btn-danger m-3">追加</button>
        </div>
      </form>
      <table class="table">
        <thead>
            <tr>
                <th>日付</th>
                <th>タスク</th>
                <th>進捗</th>
                <th>編集</th>
                <th>削除</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="todos, index in todos" :key="index">
                <th class="align-middle">{{todos.creatAt}}</th>
                <th class="align-middle">{{todos.task}}</th>
                <th class="align-middle">{{todos.progress}}</th>
                <!--編集-->
                <th>
                    <button class="btn btn-danger" @click="show(1,index)"><FontAwesomeIcon icon="fas fa-pen" /></button>
                    <modal name="modal-recipe" :draggable="false" :resizable="true" width="80%" height="auto">
                        <div class="modal-header">
                            <h3 class="mt-2">{{creatAt}}</h3>
                        </div>
                        <div class="modal-body">
                            <form class="rounded mt-5 mb-4">
                                <div class="form-group">
                                    <div class="col-md-4">
                                        <input type="text" v-model="task" class="form-control border border-danger mt-4">
                                        <textarea type="text" v-model="memo" class="form-control border border-danger mt-4"></textarea>
                                    </div>
                                    <div class="m-3">
                                        <input type="radio" v-model="progress" value="未完了" class="form-check-input">
                                        <label class="me-3">未完成</label>
                                        <input type="radio" v-model="progress" value="完了" class="form-check-input">
                                        <label class="me-3">完成</label> 
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button @click="updateTask()" @touchstart="updateTask()" class="btn btn-danger">編集</button>
                            <button @click="hide(1)" @touchstart="hide(1)" class="btn btn-secondary">戻る</button>
                        </div>
                    </modal>
                </th>
                <!--削除-->
                <th>
                    <button class="btn btn-danger" @click="show(2,index)"><FontAwesomeIcon icon="fas fa-trash-alt" /></button>
                    <modal name="modal-del" :draggable="false" :resizable="true" width="40%" height="auto">
                        <div class="modal-header">
                            <h3>本当に削除しますか？</h3>
                        </div>
                        <div class="modal-footer">
                            <button @click="deleteTask()"  @touchstart="deleteTask()" class="btn btn-danger">削除</button>
                            <button @click="hide(2)"  @touchstart="hide(2)" class="btn btn-secondary">戻る</button>
                        </div>
                    </modal>
                </th>
            </tr>
        </tbody>
      </table>
   </div> 
</template>
<script>
import Header from '../components/Header'
import {collection,doc,setDoc,onSnapshot,deleteDoc,updateDoc} from "firebase/firestore"
import  {getAuth,onAuthStateChanged} from 'firebase/auth'
import {db} from '../main'
  export default{
   data: function(){
     return{
        // 使用するデータ
        newTask: '',
        newComment: '',
        newProgress: '',
        //
        task: '',
        creatAt: '',
        memo: '',
        progress: '',
        index: '',
        todos: [],
        unsubscribe: null,
        unsubscribeCreated: null
     }
    },
    components: {
        Header: Header
    },
    methods: {
    // 使用するメソッド
        addTask(){
            if(this.newTask == '' || this.newProgress  == '') return
            var today = new Date()
            const mon = today.getMonth() + 1
            const da = today.getDate()
            var time = today.getFullYear() + "-" +  ('0' + mon).slice(-2) + "-"+ ('0' + da).slice(-2)
            const auth = getAuth()
            const user = auth.currentUser
            const collRef = collection(db, `${user.uid}`)
            const submitData = {
                task: this.newTask,
                memo: this.newComment,
                progress: this.newProgress,
                creatAt: time
            }
            setDoc(doc(collRef), submitData)
            this.newTask = ''
            this.newComment = ''
            this.newProgress = ''
            
        },
        updateTask(){
            if(this.task == '') return
            const auth = getAuth()
            const user = auth.currentUser
            const collRef = collection(db, `${user.uid}`)
            const submitData = {
                task: this.task,
                memo: this.memo,
                progress: this.progress
            }
            updateDoc(doc(collRef,this.index),submitData)
            this.hide(1)
        },
        deleteTask(){
            const auth = getAuth()
            const user = auth.currentUser;
            const collRef = collection(db,user.uid)
            deleteDoc(doc(collRef,this.index))
            this.hide(2)
        },
        show(modal_number,index){
            if(modal_number == 1){
                //編集
                this.$modal.show('modal-recipe')
                this.edit(index)
            }else{
                //削除
                this.$modal.show('modal-del')
            }
            this.index = index
        },
        edit(index){
            const auth = getAuth()
            const user = auth.currentUser
            const collRef = collection(db, `${user.uid}`)
            this.unsubscribe = onSnapshot(doc(collRef,index), (showDoc) => {
                const showObj = showDoc.data()
                this.task = showObj.task
                this.memo = showObj.memo
                this.progress = showObj.progress
                this.creatAt = showObj.creatAt
                this.unsubscribe()
            })
        },
        hide(modal_number){
            if(modal_number == 1){
                //編集
                this.$modal.hide('modal-recipe')
            }else{
                //削除
                this.$modal.hide('modal-del')
            }
        },
    },
    created: function(){
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const user = auth.currentUser
                const collRef = collection(db, `${user.uid}`)
                this.unsubscribeCreated = onSnapshot(collRef,querySnapshot => {
                    const obj = {}
                    querySnapshot.forEach(doc => {
                        obj[doc.id] = doc.data()
                })
                    this.todos = obj
                })
            }
        })
    },

  }
</script>
<style>
    .form-check-input:checked {
        background-color: #dc3545;
        border-color: #dc3545;
    }
    .form-check-input:focus{
        box-shadow: 0 0 0 0.20rem rgb(255,160,122);
    }
    .form-control:focus{
        box-shadow: 0 0 0 0.10rem rgb(255,160,122);
    }
    .btn:focus{
        box-shadow: 0 0 0 0.10rem rgb(255,160,122);
    }
</style>
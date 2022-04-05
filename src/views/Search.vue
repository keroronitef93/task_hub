<template>
  <div>
    <Header :unsubscribe-created="unsubscribeCreated"></Header>
    <form v-on:submit.prevent="searchTodo" class="border rounded mt-5 mb-4 mx-5">
        <div class="form-group">
            <h3 class="mt-2">タスクを検索する</h3>
            <div class="col-md-4">
                <Datepicker v-model="searchDate" :format="DatePickerFormat" placeholder="日付を入力" :language="ja" class="mt-4"></Datepicker>
                <input type="text" v-model="searchTask" placeholder="タスクを入力" class="form-control border border-danger mt-4">
            </div>
            <div class="m-3">
                <input type="radio" v-model="searchProgress" value="未完了" class="form-check-input">
                <label class="me-3">未完了</label>
                <input type="radio" v-model="searchProgress" value="完了" class="form-check-input">
                <label class="me-3">完了</label> 
            </div>
            <button type="submit" class="btn btn-danger m-3">検索</button>
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
            <tr v-for="todos, index in todos" v-bind:key="index">
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
                            <button @click="deleteTask()" @touchstart="deleteTask()" class="btn btn-danger">削除</button>
                            <button @click="hide(2)" @touchstart="hide(2)" class="btn btn-secondary">戻る</button>
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
import {collection,query,where,getDocs,updateDoc,doc,onSnapshot,deleteDoc} from "firebase/firestore"
import  {getAuth} from 'firebase/auth'
import {db} from '../main'
import {ja} from 'vuejs-datepicker/dist/locale'
import moment from 'moment'
  export default{
    data: function(){
     return{
        // 使用するデータ
        searchTask: '',
        searchDate: '',
        searchProgress: '',
        //
        customDate: '',
        task: '',
        creatAt: '',
        memo: '',
        progress: '',
        index: '',
        todos: [],
        unsubscribe: null,
        unsubscribeCreated: null,
        q: null,
        DatePickerFormat: 'yyyy-MM-dd',
        ja:ja
     }
    },
   components: {
     Header: Header
    },
    methods: {
        searchTodo(){
            if(this.searchDate  == '' && this.searchTask  == '' && this.searchProgress  == '') return
            const auth = getAuth()
            const user = auth.currentUser
            const serchRef = collection(db, `${user.uid}`)
            this.customDate = this.customformat(this.searchDate)
            if(this.searchTask  !== '' && this.searchDate  !== '' && this.searchProgress  !== ''){
                this.q = query(serchRef,where("creatAt", "==", `${this.customDate}`),where("task", "==", `${this.searchTask}`),where("progress", "==", `${this.searchProgress}`))
            }else if(this.searchTask !== '' && this.searchDate !== ''){
                this.q = query(serchRef,where("creatAt", "==", `${this.customDate}`),where("task", "==", `${this.searchTask}`))
            }else if(this.searchTask !== '' && this.searchProgress !== ''){
                this.q = query(serchRef,where("task", "==", `${this.searchTask}`),where("progress", "==", `${this.searchProgress}`))
            }else if(this.searchDate !== '' && this.searchProgress !== ''){
                this.q = query(serchRef,where("creatAt", "==", `${this.customDate}`),where("progress", "==", `${this.searchProgress}`))
            }else if(this.searchTask !== ''){
                this.q = query(serchRef,where("task", "==", `${this.searchTask}`))
            }else if(this.searchProgress !== ''){
                this.q = query(serchRef,where("progress", "==", `${this.searchProgress}`))
            }else{
                this.q = query(serchRef,where("creatAt", "==", `${this.customDate}`))
            }
            this.display(this.q)
        },
        display(q){
            getDocs(q).then((querySnapshot) => {
                const obj = {}
                querySnapshot.forEach((doc) => {
                    obj[doc.id] = doc.data()
                })
                //検索タスクがない場合
                if(this.isEmpty(obj)){
                    alert("検索されたタスクは存在しません")
                }
                this.todos = obj
            })
            this.searchTask == ''
            this.searchDate  == ''
            this.searchProgress  == ''
        },
        customformat(value){
            return moment(value).format('YYYY-MM-DD')
        },
        isEmpty(obj){
            //タスクチェック
            return !Object.keys(obj).length
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
            this.display(this.q)
        },
        deleteTask(){
            const auth = getAuth()
            const user = auth.currentUser;
            const collRef = collection(db,user.uid)
            deleteDoc(doc(collRef,this.index))
            this.hide(2)
            this.display(this.q)
        },
        show(modal_number,index){
            if(modal_number == 1){
                this.$modal.show('modal-recipe')
                this.edit(index)
            }else{
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
                this.$modal.hide('modal-recipe')
            }else{
                this.$modal.hide('modal-del')
            }
        },
    }
  }
</script>
<style scoped>

</style>

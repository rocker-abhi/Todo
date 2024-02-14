
import './App.css';

import React, { Component } from 'react'

export default class App extends Component {

  constructor(props){
    super(props);

      this.state={
        todoList:[],
        activateItem:{
          id:null,
          title:'',
          completed:false
        },
        editing:false,
      }

      this.fetchTask = this.fetchTask.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  strikeUnstrike(task){
    task.completed = !task.completed
    var csrf = this.getCookie('csrftoken')
    var urls = `http://127.0.0.1:8000/api/update-task/${task.id}`

    fetch(urls,{
      method:"POST",
      headers:{
        'content-type':'application/json',
        'X-CSRFToken': csrf,
      },
      body:JSON.stringify({'completed': task.completed, 'title': task.title})
    }).then(()=>{
      this.fetchTask()
    })
    console.log('TASK', task.completed)
  }

  componentDidMount(){
    this.fetchTask()
  }

  fetchTask(){
    console.log("fetching.")
    fetch("http://127.0.0.1:8000/api/")
    .then(Response => Response.json())
    .then(data => 
      this.setState({
        todoList:data
      })
      )
  }

  handleChange(e){
    // var name = e.target.name
    var value = e.target.value
    // console.log(name)
    // console.log(value)
    this.setState({
      activateItem:{
        ...this.state.activateItem,
        title:value
      }
    })
  }

  deleteItem(task){
    var csrf = this.getCookie('csrftoken')
    
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`,{
      method:'DELETE',
      headers:{
        'content-type':"application.json",
        'X-CSRFToken':csrf,
      },
    }).then((response)=>{
      this.fetchTask()
    })
  }


  handleSubmit(e){
    e.preventDefault()
    // console.log('Item', this.state.activateItem)
    var url = 'http://127.0.0.1:8000/api/create-task/'

    var csrf = this.getCookie('csrftoken')

    if (this.state.editing === true){
      url = `http://127.0.0.1:8000/api/update-task/${this.state.activateItem.id}`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrf
      },
      body:JSON.stringify(this.state.activateItem)
    }).then((response)  => {
        this.fetchTask()

        this.setState({
          activateItem:{
            ...this.state.activateItem,
            title:"",
            id : null,
            completed : false
          }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })
    console.log(this.state.activateItem)
  }

  startEdit(task){
    this.setState({
      activateItem:task,
      editing:true,
    })
  }

  render() {
    var tasks = this.state.todoList
    var self = this
    return (
      <div>
        <>
          <div className="container mx-auto shadow-lg mt-5">
            <form id='form' className='p-2' onSubmit={this.handleSubmit}>
              <div className="form">
                <input type="text" onChange={this.handleChange} className="form-control p-2 mt-5" id="title" value={this.state.activateItem.title} placeholder="Enter text"/>
              </div>
              <button type="submit" className="btn btn-danger mt-5 mb-5  ">SUBMIT</button>
            </form>
          </div>
          <div className="container mx-auto shadow-lg mt-5">
            <div id="list-wrapper" className='p-3'>
              {
                tasks.map(function(task, index){
                  return(
                    <div key={index} className='task-wrapper flex-wrapper' >
                      <div style={{flex:7}} onClick={() => self.strikeUnstrike(task)}>
                        {task.completed === false ? (
                          <h5 className='mt-1'>{task.title}</h5>
                        ): (
                          <strike><h5 className='mt-1'>{task.title}</h5></strike>
                        )}
                      </div>
                      <div style={{flex:1}}>
                        <button onClick={() => self.startEdit(task)} className='btn btn-primary '>EDIT</button>
                      </div>
                      <div style={{flex:1}}>
                        <button onClick={()=> self.deleteItem(task)} className='btn btn-dark'>-</button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </>
      </div>
    )
  }
}


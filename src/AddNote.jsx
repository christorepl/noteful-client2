import React, {Component} from 'react';
import config from './config';
import ApiContext from './ApiContext';
import ValidationError from './ValidationError';


export default class AddNote extends Component {
  state = {
    noteName : {
      value: '',
      touched: false
    },
    noteFolderId : {
      value: '',
      touched: false
    },
    noteContent : {
      value: '',
      touched: false
    }      
  }

  static contextType = ApiContext;

  updateNoteName(title){
    this.setState({noteName: {value: title, touched: true}});
  }

  validateName() {
    const title = this.state.noteName.value.trim();
    if (title.length === 0) {
      return 'Note name is required';
    }
  }

  updateNoteFolderId(folderId){
    this.setState({noteFolderId: {value: folderId, touched: true}});
  }

  validateFolderId() {
    const folderId = this.state.noteFolderId.value.trim();
    if (folderId.length === 0) {
      return 'Please select a folder to add note to';
    }
  }

  updateNoteContent(content){
    this.setState({noteContent: {value: content, touched: true}});
  }

  validateContent() {
    const content = this.state.noteContent.value.trim();
    if (content.length === 0) {
      return 'Please enter content for note';
    }
  }


  handleSubmit(event) {
    event.preventDefault();
    const { noteName, noteContent, noteFolderId } = this.state;
    const noteObject = {
      "title": noteName.value,
      "content": noteContent.value,
      "folder": noteFolderId.value,
      "modified": new Date()
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(noteObject)
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(e => Promise.reject(e))
      return res.json()
    })
    .then(note => {
      this.props.history.push(`/`);
      this.context.addNote(note);
    })
    .catch(error => {
      console.error({ error })
    })
  }

  render() {
    const folders = this.context.folders.map(folder => 
      <option 
        key={folder.id} 
        value={folder.id}
      >
        {folder.title}
      </option>);

    const noteNameError = this.validateName();
    const noteFolderIdError = this.validateFolderId();
    const noteContentError = this.validateContent();

    return (
      <form className="addFolder" 
        onSubmit={e => this.handleSubmit(e)} 
        style={{backgroundColor:"lightblue", padding:"10px"}}>
        <h2>Add Note</h2>
        <p><strong>All fields are required.</strong></p>
        <label htmlFor="note__name">Note Name: </label>
        <input type="text" name="note__name" id="note__name"
          onChange={e => this.updateNoteName(e.target.value)}/>
          {this.state.noteName.touched && (
          <ValidationError message={noteNameError} />
        )}
        <br/>
        
        <label htmlFor="note__folderId">Select Folder: </label>
        <select 
          onClick={e => this.updateNoteFolderId(e.target.value)}>
          <option value="">Please select a folder</option>
          {folders}
        </select>
        {this.state.noteFolderId.touched && (
          <ValidationError message={noteFolderIdError} />
        )}
        <br/>

        <label htmlFor="note__content">Note Content: </label>
        <textarea name="note__content" id="note__content" rows="5"
          onChange={e => this.updateNoteContent(e.target.value)}/>
        {this.state.noteContent.touched && (
          <ValidationError message={noteContentError} />
        )}
        <br/>

        <button type="submit" disabled={noteNameError || noteFolderIdError || noteContentError}>Submit</button>
      </form>
    );
  }
}
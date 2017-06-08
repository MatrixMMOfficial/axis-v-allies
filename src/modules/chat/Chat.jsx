import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebase, helpers } from 'redux-react-firebase'

const { isLoaded, isEmpty, dataToJS } = helpers

class Chat extends Component {

  handleAdd () {
    const { newMessage } = this.refs
    this.props.firebase.push('/messages', { text: newMessage.value })
    newMessage.value = ''
  }

  messageList (messages) {
    if (!isLoaded(messages)) {
      return 'Loading'
    } else if (isEmpty(messages)) {
      return <li>No messages yet</li>
    } else {
      return Object.keys(messages).map(key => <li key={key}>{messages[key].text}</li>)
    }
  }
  render () {
    const { messages } = this.props /* also firebase is in props */
    return (
      <section id="chat">
        <h2>Messages</h2>
        <ul>{this.messageList(messages)}</ul>
        <input type="text" ref="newMessage" />
        <button onClick={this.handleAdd.bind(this)}>Add</button>
      </section>
    )
  }
}
const fbWrappedChat = firebase(['/messages'])(Chat)
export default connect(
  ({ firebase }) => ({
    messages: dataToJS(firebase, 'messages')
  })
)(fbWrappedChat)


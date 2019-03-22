import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  TextField,
  IconButton,
  Card,
  CardContent,
  Menu,
  MenuItem,
} from '@material-ui/core'
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons'
import ChipInput from 'material-ui-chip-input'
import formatTime from '../utils/formatTime'
import * as r from '../redux'
import css from './FlashcardForm.module.css'

class FlashcardForm extends Component {
  state = { moreMenuAnchorEl: null }

  handleClickMoreButton = event => {
    this.setState({ moreMenuAnchorEl: event.currentTarget })
  }

  handleCloseMoreMenu = () => {
    this.setState({ moreMenuAnchorEl: null })
  }

  handleFlashcardSubmit = e => {
    e.preventDefault()
    this.nextFile()
    this.germanInput.focus()
  }

  setFlashcardText = (key, text) => {
    this.props.setFlashcardField(this.props.selectedClipId, key, text)
  }
  setFlashcardTagsText = text =>
    this.props.setFlashcardTagsText(this.props.selectedClipId, text)

  handleAddChip = text =>
    this.props.addFlashcardTag(this.props.selectedClipId, text)
  handleDeleteChip = (text, index) =>
    this.props.deleteFlashcardTag(this.props.selectedClipId, index)

  deleteCard = () => {
    const { deleteCard, highlightedClipId } = this.props
    if (highlightedClipId) {
      deleteCard(highlightedClipId)
    }
  }

  editCardTemplate = () =>
    this.props.editNoteTypeDialog(this.props.currentNoteType.id)

  inputRefs = {}
  inputRef = name => el => (this.inputRefs[name] = el)

  render() {
    const { currentFlashcard, selectedClipTime, currentNoteType } = this.props
    const { moreMenuAnchorEl } = this.state

    return (
      <Card className={css.container}>
        <CardContent>
          <form className="form" onSubmit={this.handleFlashcardSubmit}>
            <div className="formBody">
              <p className={css.timeStamp}>
                {formatTime(selectedClipTime.start)}
                {' - '}
                {formatTime(selectedClipTime.end)}
              </p>
              {currentNoteType.fields.map(({ name, id }) => (
                <section key={`${id}_${currentFlashcard.id}`}>
                  <TextField
                    inputRef={this.inputRef(id)}
                    onChange={e => this.setFlashcardText(id, e.target.value)}
                    value={currentFlashcard.fields[id] || ''}
                    fullWidth
                    multiline
                    label={name}
                  />
                </section>
              ))}

              {currentNoteType.useTagsField && (
                <ChipInput
                  label="Tags"
                  placeholder="Type your tag and press 'enter'"
                  className={css.tagsField}
                  inputRef={this.inputRef('tags')}
                  value={currentFlashcard.tags || []}
                  fullWidth
                  onAdd={chip => this.handleAddChip(chip)}
                  onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
                />
              )}

              <section className={css.bottom}>
                <span className={css.noteTypeName}>
                  Using note type:{' '}
                  <span
                    className={css.noteTypeNameLink}
                    onClick={this.editCardTemplate}
                  >
                    {currentNoteType.name}
                  </span>
                </span>
                <IconButton
                  className={css.moreMenuButton}
                  onClick={this.handleClickMoreButton}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={moreMenuAnchorEl}
                  open={Boolean(moreMenuAnchorEl)}
                  onClose={this.handleCloseMoreMenu}
                >
                  <MenuItem onClick={this.editCardTemplate}>
                    Edit card template
                  </MenuItem>
                  <MenuItem onClick={this.deleteCard}>Delete card</MenuItem>
                </Menu>
              </section>
              {/* <IconButton
                className={css.deleteButton}
                onClick={this.deleteCard}
              >
                <DeleteIcon />
              </IconButton> */}
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  currentFlashcard: r.getCurrentFlashcard(state),
  selectedClipTime: r.getSelectedClipTime(state),
  selectedClipId: r.getSelectedClipId(state),
  highlightedClipId: r.getHighlightedClipId(state),
  clipsTimes: r.getClipsTimes(state),
  currentNoteType: r.getCurrentNoteType(state),
})

const mapDispatchToProps = {
  setCurrentFile: r.setCurrentFile,
  setFlashcardField: r.setFlashcardField,
  deleteCard: r.deleteCard,
  makeClips: r.makeClips,
  exportFlashcards: r.exportFlashcards,
  highlightClip: r.highlightClip,
  initializeApp: r.initializeApp,
  detectSilenceRequest: r.detectSilenceRequest,
  deleteAllCurrentFileClipsRequest: r.deleteAllCurrentFileClipsRequest,
  setFlashcardTagsText: r.setFlashcardTagsText,
  addFlashcardTag: r.addFlashcardTag,
  deleteFlashcardTag: r.deleteFlashcardTag,
  editNoteTypeDialog: r.editNoteTypeDialog,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashcardForm)

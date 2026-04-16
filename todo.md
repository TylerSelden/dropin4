## To do:

### Beta launch:

- [X] Verify code written in 8b5198
- [X] Boot user from `/chat` if they aren't acgually in a room
- [X] Enter on `/home` triggers the Join button
  - [X] Join button cursor changes to pointer on hover
- [X] localStorage on home menu
- [X] Add loading spinner
- [ ] Error messages
  - [ ] Failed to connect message on home menu when necessary
- [ ] Scrolling when messages come in while user is at the bottom (including when they first join a room)
- [ ] Navigation to `/home` unsubscribes from the current room
  - [ ] Joining a room clears all prior messages
- [ ] Paging (load more messages when scrolling up)
- [ ] Fix textarea flickering and incorrect positioning while typing / resizing on mobile
- [ ] Smooth Scrolling on new messages
- [ ] Spacing that's less ugly
  - [ ] Fix spacing issues when username width exceeds message width
- [ ] Add `Beta` badge to the title
- [ ] Add settings menu
- [ ] Add the chat name at the top
- [ ] Make username size larger
- [ ] Replay connection logic after a reconnect
- [ ] Better contrast in `!` message in home menu
  - [ ] ~Change the `!` to use the markdown library?~
- [ ] Change checkmark color to be deeper

### Post-beta launch:

- [ ] Multiple rooms functionality
  - [ ] Add reconnect functionality
- [ ] Admin panel
  - [ ] R/D users
  - [ ] R/W/D rooms
  - [ ] R/W/D popup messages

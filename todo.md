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
- [X] Spacing that's less ugly
- [X] Fix spacing issues when username width exceeds message width
- [X] Add `Beta` badge to the title
- [ ] Add the chat name at the top
- [X] Make username size larger
- [ ] Replay connection logic after a reconnect
- [ ] Add max stored messages for rooms (server-side)
- [ ] Max message age (and daily pruning routine)
- [!] Better contrast in `!` message in home menu
  - [X] ~~Change the `!` to use the markdown library?~~
- [X] ~~Change checkmark color to be deeper~~
- [X] ~~Convert `connected` element to a badge~~
- [ ] HOSTING STATIC WEB FILES FOR `npm start`!

### Post-beta launch:

- [ ] Add settings menu if need arises
- [ ] Multiple rooms functionality
  - [ ] Add reconnect functionality for multiple rooms
- [X] ~~Admin panel~~
  - [X] ~~R/D users~~
  - [X] ~~R/W/D rooms~~
  - [X] ~~R/W/D popup messages~~

## To do:

### Beta launch:

- [X] Verify code written in 8b5198
- [X] Boot user from `/chat` if they aren't acgually in a room
- [X] Enter on `/home` triggers the Join button
  - [X] Join button cursor changes to pointer on hover
- [X] localStorage on home menu
- [X] Add loading spinner
- [X] Error messages
- [X] Scrolling when messages come in while user is at the bottom (including when they first join a room)
- [X] Disable sending when message content is invalid
- [X] Navigation to `/home` unsubscribes from the current room
  - [X] Unsubscribing clears messages locally (client)
- [ ] Paging (load more messages when scrolling up)
- [X] ~~Fix textarea flickering and incorrect positioning while typing / resizing on mobile~~ (unfixable, thanks Apple)
- [X] Smooth Scrolling on new messages
- [X] Spacing that's less ugly
- [X] Fix spacing issues when username width exceeds message width
- [X] Add `Beta` badge to the title
- [X] ~~Add the chat name at the top~~ (security purposes)
- [X] ~~Rate Limits~~ (should be handled by the host)
- [ ] Add an npm format script that prettifies and searches for unused code
- [X] Make username size larger
- [X] Replay connection logic after a reconnect
- [ ] Migrate db config options to .env or something
  - [ ] Remove traces in the code
- [X] Non-persistent rooms
- [ ] Max message age (and daily pruning routine)
- [X] Better contrast in `!` message in home menu
  - [X] ~~Change the `!` to use the markdown library?~~
- [X] ~~Change checkmark color to be deeper~~
- [X] ~~Convert `connected` element to a badge~~
- [ ] package.json build script (add build dir to gitignore)
- [ ] package.json start script (have it make sure there's an existing build)
- [ ] Dockerfile and docker-compose.yml
- [ ] Enable the backend to host the pre-built web files

exports.commands = { 
    dicerules: 'dicecommands',
    dicehelp: 'dicecommands',
    dicecommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Dice rules and commands</center></font></u><br />' +
            '<b>/dicegame OR /diceon [amount]</b> - Starts a dice game in the room for the specified amount of points. Must be ranked + or higher to use.<br />' +
            '<b>/play</b> - Joins the game of dice. You must have more or the same number of points the game is for. Winning a game wins you the amount of points the game is for. Losing the game removes that amount from you.<br />' +
            '<b>/diceend</b> - Ends the current game of dice in the room. You must be ranked + or higher to use this.');
    },

    dicegame: 'diceon',
    diceon: function(target, room, user, connection, cmd) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to be able to start a game of dice.');
        if (room.dice) return this.sendReply('There is already a game of dice game going on in this room.');
        target = toId(target);
        if (!target) return this.sendReply('/' + cmd + ' [amount] - Starts a dice game. The specified amount will be the amount of cash betted for.');
        if (isNaN(target)) return this.sendReply('That isn\'t a number, you egg.');
        if (target < 1) return this.sendReply('You cannot start a game of dice for anything less than 1 point.');
        room.dice = {};
        room.dice.members = [];
        room.dice.award = parseInt(target);
		var point = (target == 1) ? 'point' : 'points';
        this.add('|html|<div class="infobox"><font color = #007cc9><center><h2>' + user.name + ' has started a game of dice for <font color = green>' + room.dice.award + '</font color> '+point+'!<br />' +
            '<center><button name="send" value="/play" target="_blank">Click to join!</button>');
    },

    play: function(target, room, user, connection, cmd) {
        if (!room.dice) return this.sendReply('There is no dice game going on now');
        if (money.checkAmt(user.userid, 'money') < room.dice.award) return this.sendReply("You don't have enough money to join this game of dice.");
        for (var i = 0; i < room.dice.members.length; i++) {
            if ((Users.get(room.dice.members[i]) || toId(room.dice.members[i])) == user.userid) 
            return this.sendReply("You have already joined the game of dice!");
        }
        room.dice.members.push(user.userid);
        this.add('|html|<b>' + user.name + ' has joined the game!');
        if (room.dice.members.length == 2) {
            var point = (room.dice.award == 1) ? 'point' : 'points';
            result1 = Math.floor((Math.random() * 6) + 1);
            result2 = Math.floor((Math.random() * 6) + 1);
            if (result1 > result2) {
                var result3 = '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                var losemessage = 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
            } else if (result2 > result1) {
                var result3 = '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                var losemessage = 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
            } else {
                var result3;
                var losemessage;
                do {
                    result1 = Math.floor((Math.random() * 6) + 1);
                    result2 = Math.floor((Math.random() * 6) + 1);
                } while (result1 === result2);
                if (result1 > result2) {
                    result3 = '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                    losemessage = 'Better luck next time, ' + Users.get(room.dice.members[1]).name + '!';
                } else {
                    result3 = '' + Users.get(room.dice.members[1]).name + ' has won ' + room.dice.award + ' ' + point + '!';
                    losemessage = 'Better luck next time, ' + Users.get(room.dice.members[0]).name + '!';
                }
            }
            var dice1, dice2;
            switch (result1) {
                case 1:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
                    break;
                case 2:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
                    break;
                case 3:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
                    break;
                case 4:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
                    break;
                case 5:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
                    break;
                case 6:
                    dice1 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
                    break;
            }

            switch (result2) {
                case 1:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/1_zps4bef0fe2.png";
                    break;
                case 2:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/2_zpsa0efaac0.png";
                    break;
                case 3:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/3_zps36d44175.png";
                    break;
                case 4:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/4_zpsd3983524.png";
                    break;
                case 5:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/5_zpsc9bc5572.png";
                    break;
                case 6:
                    dice2 = "http://i1171.photobucket.com/albums/r545/Brahak/6_zps05c8b6f5.png";
                    break;
            }

            room.add('|html|<div class="infobox"><center><b>The dice game has been started!</b><br />' +
                'Rolling the dice...<br />' +
                '<img src = "' + dice2 + '" align = "left"><img src = "' + dice1 + '" align = "right"><br/>' +
                '<b>' + Users.get(room.dice.members[0]).name + '</b> rolled ' + result1 + '!<br />' +
                '<b>' + Users.get(room.dice.members[1]).name + '</b> rolled ' + result2 + '!<br />' +
                '<b>' + result3 + '</b><br />' + losemessage);
            if (result3 === '' + Users.get(room.dice.members[0]).name + ' has won ' + room.dice.award + ' ' + point + '!') {
                money.giveAmt(Users.get(room.dice.members[0]).userid, 'money', room.dice.award);
                money.removeAmt(Users.get(room.dice.members[1]).userid, 'money', room.dice.award);
            } else {
                money.giveAmt(Users.get(room.dice.members[1]).userid, 'money', room.dice.award);
                money.removeAmt(Users.get(room.dice.members[0]).userid, 'money', room.dice.award);
            }
            delete room.dice;
        }
    },

    diceend: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a game of dice.');
        if (!room.dice) return this.sendReply("There is no game of dice going on in this room right now.");
        this.add('|html|<b>The game of dice has been ended by ' + user.name);
        delete room.dice;
    }, 

    pollhelp: 'pollcommands',
    pollcommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        return this.sendReplyBox('<u><font size = 2><center>Poll commands</center></font></u><br />' +
            '<b>/poll [question], [option 1], [option 2], etc.</b> - Starts a poll in the room. Must be ranked + or higher to use.<br />' +
            '<b>/vote [option]</b> - Votes on a poll option.<br />' +
            '<b>/unvote OR /removevote </b> - Removes your vote for a poll option.<br />' +
            '<b>/pollusers </b> - Checks the number of users who are voting.<br />' +
            '<b>/pollremind or /prm</b> - Checks the poll options of the poll. Can be broadcasted.<br />' +
            '<b>/pollend OR /endpoll</b> - Ends the current poll. Must be ranked + or higher to use.');
    },

    poll: function(target, room, user) {
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to start a poll.');
        if (room.poll) return this.sendReply('There is already a poll going on in this room.');
        if (!target) return this.sendReply('/poll [question], [option 1], [option 2], etc. - Starts a poll in the room with the given number of options.');
        target = target.split(',');
        if (target.length < 3) return this.sendReply('You need to have at least 2 different poll options.');
        var options = '';
        for (var i = 1; i < target.length; i++) {
            if (!target[i].replace(/ /g, '')) return this.sendReply('A poll option cannot be blank.');
            options += '<li><button name = "send" value = "/vote ' + target[i] + '">' + target[i] + '</button><br/>';
        }
        room.poll = {};
        room.poll.question = target[0];
        room.poll.starter = user.name;
        room.poll.users = {};
        room.poll.options = {};
        for (var i = 1; i < target.length; i++) {
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')] = {};
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')].name = target[i].trim();
            room.poll.options[target[i].toLowerCase().replace(/ /g, '')].count = 0;
        }
        return this.add('|html|<div class = "infobox"><center><font size = 3><b>' + target[0] + '</b></font></center><br/>' +
            '<font color = "gray" size = 2><i><b>Poll started by ' + user.name + '</b></i></font><br/>' +
            '<hr>' + options);
    },

    votes: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Number of votes: ' + Object.keys(room.poll.users).length);
    },

    voteoption: 'vote',
    vote: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        var originaltarget = target;
        target = target.toLowerCase().replace(/ /g, '');
        if (Object.keys(room.poll.options).indexOf(target) == -1) return this.sendReply("'" + originaltarget + "' is not a valid poll option.");
        for (var i in room.poll.users) {
            if (Users.get(i) == user.userid && i != user.userid) return this.sendReply('One of your alts are already voting in this poll.');
        }
        if (!room.poll.users[user.userid]) {
            room.poll.users[user.userid] = room.poll.options[target].name;
            room.poll.options[target].count++;
            return this.sendReply('You are now voting for \'' + room.poll.options[target].name + '\'');
        } else {
            if (room.poll.users[user.userid] == room.poll.options[target].name) return this.sendReply("You are already voting for '" + room.poll.options[target].name + "'.");
            var oldpoll = room.poll.users[user.userid];
            room.poll.users[user.userid] = room.poll.options[target].name;
            room.poll.options[target].count++;
            room.poll.options[oldpoll.toLowerCase().replace(/ /g, '')].count--;
            return this.sendReply('You are now voting for \'' + room.poll.options[target].name + '\' instead of \'' + oldpoll + '\'.');
        }
    },
    
    pr: 'pollremind',
    pollremind: 'prm',
    prm: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.');
        if (!this.canBroadcast()) return;
        var options = '';
        for (var i in room.poll.options) {
            options += '<li><button name = "send" value = "/vote ' + room.poll.options[i].name + '">' + room.poll.options[i].name + '</button><br/>';
        }
        if (this.broadcasting) {
            this.sendReply('|html|<div class = "infobox"><center><font size = 3><b>' + room.poll.question + '</b></font></center><br/>' +
                '<font color = "gray" size = 2><i><b>Poll started by ' + room.poll.starter + '</b></i></font><br/>' +
                '<hr>' + options);
        } else {
            this.sendReply('|html|<div class = "infobox"><center><font size = 3><b>' + room.poll.question + '</b></font></center><br/>' +
                '<font color = "gray" size = 2><i><b>Poll started by ' + room.poll.starter + '</b></i></font><br/>' +
                '<hr>' + options);
        }
    },
    
    pollend: 'endp',
    endpoll: 'endp',
    endp: function(target, room, user) {
        if (!room.poll) return this.sendReply('There is no poll going on in this room.')
        if (!this.can('broadcast', null, room)) return this.sendReply('You must be ranked + or higher to end a poll.');
        if (Object.keys(room.poll.users).length < 2) {
            delete room.poll;
            return this.add('|html|<b>The poll has been canceled due to the lack of voters.');
        }
        var total = '';
        for (var i in room.poll.options) {
            if (room.poll.options[i].count > 0)
                total += '<li>' + room.poll.options[i].name + ' - ' + room.poll.options[i].count + ' (' + Math.round(((room.poll.options[i].count) / Object.keys(room.poll.users).length) * 100) + '%)';
        }
        this.add('|html|<div class = "infobox"><center><font size = 3><b>Results to \'' + room.poll.question + '\'</b></font></center><br/>' +
            '<font color = "gray" size = 2><i><b>Poll ended by ' + user.name + '</b></i></font><br/>' +
            '<hr>' + total);
        delete room.poll;
    }
};

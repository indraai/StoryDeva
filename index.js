// Copyright (c)2023 Quinn Michaels
// The Systems Deva manages the various @STORY in deva.world

const fs = require('fs');
const path = require('path');

const package = require('./package.json');
const info = {
  id: package.id,
  name: package.name,
  describe: package.description,
  version: package.version,
  url: package.homepage,
  git: package.repository.url,
  bugs: package.bugs.url,
  author: package.author,
  license: package.license,
  copyright: package.copyright,
};

const data_path = path.join(__dirname, 'data.json');
const {agent,vars} = require(data_path).DATA;

const Deva = require('@indra.ai/deva');
const STORY = new Deva({
  info,
  agent: {
    id: agent.id,
    key: agent.key,
    describe: agent.describe,
    prompt: agent.prompt,
    voice: agent.voice,
    profile: agent.profile,
    translate(input) {
      return input.trim();
    },
    parse(input) {
      return input.trim();
    }
  },
  vars,
  listeners: {},
  modules: {},
  deva: {},
  func: {
    sto_question(packet) {
      const agent = this.agent();
      const story = this.story();
      story.personal.questions.push(packet);
    },
    sto_answer(packet) {
      const agent = this.agent();
      const story = this.story();
      story.personal.answers.push(packet);
    },

    /**************
    func: build sstory
    params: text - the main text to include in the content of hte story.
    describe: this is the function that will build the story to pass around with the proper headers and values.
    ***************/
    // buildStory(text, agent) {
    //   this.prompt('BULD STORY');
    //   return new Promise((resolve, reject) => {
    //     this.vars.story.build = [];
    //     this.prompt('SET CONFIG');
    //     return this.question(`#docs view ${this.vars.story.doc}:config`).then(config => {
    //       const _text = [
    //         config.a.text,
    //         `#${this.vars.chat.storyteller}: ${this.vars.story.teller}`,
    //       ].join('\n');
    //       this.vars.story.build.push('::BEGIN:CONFIG');
    //       this.vars.story.build.push(_text);
    //       this.vars.story.build.push(`::END:CONFIG:${this.func.hash(_text)}`);
    //       this.prompt(this.vars.messages.hader);
    //       return this.question(`#docs view ${this.vars.story.doc}:header`);
    //     }).then(header => {
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push('::BEGIN:HEADER');
    //       this.vars.story.build.push(header.a.text);
    //       this.vars.story.build.push(`::END:HEADER:${this.func.hash(header.a.text)}`);
    //
    //       this.prompt(this.vars.messages.meta);
    //       return this.question(`#docs view ${this.vars.story.doc}:meta`);
    //     }).then(meta => {
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push('::BEGIN:META');
    //       this.vars.story.build.push(meta.a.text);
    //       this.vars.story.build.push(`::END:META:${this.func.hash(meta.a.text)}`);
    //
    //       this.prompt(this.vars.messages.outline);
    //       return this.question(`#docs view ${this.vars.story.doc}:outline`);
    //     }).then(outline => {
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push('::BEGIN:OUTLINE');
    //       this.vars.story.build.push(outline.a.text);
    //       this.vars.story.build.push(`::END:OUTLINE:${this.func.hash(outline.a.text)}`);
    //
    //       this.prompt(this.vars.messages.story);
    //       const _draftstory = [
    //         '',
    //         agent.greeting,
    //         '',
    //         text,
    //         '',
    //         agent.signature,
    //         '',
    //       ].join('\n');
    //
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push(`::BEGIN:${agent.section}`);
    //       this.vars.story.build.push(_draftstory);
    //       this.vars.story.build.push(`::END:${agent.section}:${this.func.hash(_draftstory)}`);
    //
    //       this.prompt(this.vars.messages.footer);
    //       return this.question(`#docs view ${this.vars.story.doc}:footer`);
    //     }).then(footer => {
    //
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push('::BEGIN:FOOTER');
    //       this.vars.story.build.push(footer.a.text);
    //       this.vars.story.build.push(`::END:FOOTER:${this.func.hash(footer.a.text)}`);
    //
    //       this.prompt(this.vars.messages.hash);
    //       const _fullstory = this.lib.copy(this.vars.story.build).join('\n')
    //                             .replace(/::from::/g, `${agent.name}`)
    //                             .replace(/::title::/g, this.vars.story.title)
    //                             .replace(/::author::/g, this.vars.story.author)
    //                             .replace(/::describe::/g, this.vars.story.describe);
    //
    //       const _date = Date.now();
    //       const _hash = `${_fullstory}${this.vars.story.id}${_date}`;
    //       this.vars.story.build.push('');
    //       this.vars.story.build.push(`hash:${this.func.hash(_hash)}`);
    //
    //       const _wholestory = this.lib.copy(this.vars.story.build).join('\n')
    //       return resolve(_wholestory)
    //     }).catch(reject);
    //   });
    // },

    tell(packet) {
      return new Promise((resolve, reject) => {
        const data = {};

        this.question(`#docs view ${packet.q.text}`).then(doc => {
          data.doc = doc.a.data // set the data into an object for retrieval later.
          packet.q.text = doc.a.text;
          return this.func.chat(packet.q);
        }).then(gpt => {
          data.gpt = gpt.data;
          return resolve({
            text: gpt.text,
            html: gpt.html,
            data,
          });
        }).catch(reject)
      });
    },
  },
  methods: {
    /**************
    method: uid
    params: packet
    describe: Return a system id to the user from the :name:.
    ***************/
    uid(packet) {
      return Promise.resolve({text:this.uid()});
    },

    /**************
    method: status
    params: packet
    describe: Return the current status of the :name:.
    ***************/
    status(packet) {
      return this.status();
    },

    /**************
    method: help
    params: packet
    describe: The Help method returns the information on how to use the :name:.
    ***************/
    help(packet) {
      return new Promise((resolve, reject) => {
        this.lib.help(packet.q.text, __dirname).then(help => {
          return this.question(`#feecting parse ${help}`);
        }).then(parsed => {
          return resolve({
            text: parsed.a.text,
            html: parsed.a.html,
            data: parsed.a.data,
          });
        }).catch(reject);
      });
    }
  },
  onDone(data) {
    this.listen('devacore:question', packet => {
      if (packet.q.text.includes(this.vars.trigger)) return this.func.sto_question(packet);
    });
    this.listen('devacore:answer', packet => {
      if (packet.a.text.includes(this.vars.trigger)) return this.func.sto_answer(packet);
    });
    return Promise.resolve(data);
  },
});
module.exports = STORY

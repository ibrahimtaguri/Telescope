// const Formsy = require('formsy-react');
// const FRC = require('formsy-react-components');

import Messages from "meteor/nova:core";

import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Checkbox = FRC.Checkbox;
const CheckboxGroup = FRC.CheckboxGroup;
const Input = FRC.Input;
const RadioGroup = FRC.RadioGroup;
const Select = FRC.Select;
const Textarea = FRC.Textarea;

const PostNew = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    categories: React.PropTypes.array
  },

  getInitialState() {
    return {
      canSubmit: false
    }
  },
  
  submitForm(data) {
    // remove any empty properties
    post = _.compactObject(data); 

    post = Telescope.callbacks.run("posts.new.client", post);

    Meteor.call('posts.new', post, (error, post) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Post created.", "success")
        FlowRouter.go('posts.single', post);
      }
    });
  },

  renderAdminForm() {
    return (
      <div className="admin-fields">
        <RadioGroup
          name="status"
          value=""
          label="Status"
          options={Posts.config.postStatuses}
        />
        <Checkbox
          name="sticky"
          value=""
          label="Sticky"
        />
      </div>
    )
  },

  render() {
     
    ({CanCreatePost} = Telescope.components);

    const categoriesOptions = this.props.categories.map(category => {
      return {
        value: category._id,
        label: category.name
      }
    });

    return (
      <CanCreatePost user={this.props.currentUser}>
        <div className="post-new">
          <h3>New Post</h3>
          <Formsy.Form onSubmit={this.submitForm}>
           <Input
              name="url"
              value=""
              label="URL"
              type="text"
              className="text-input"
            />
            <Input
              name="title"
              value=""
              label="Title"
              type="text"
              className="text-input"
            />
            <Textarea
              name="body"
              value=""
              label="Body"
              type="text"
              className="textarea"
            />
            <CheckboxGroup
              name="categories"
              value=""
              label="Categories"
              type="text"
              options={categoriesOptions}
            />
            {Users.is.admin(this.props.currentUser) ? this.renderAdminForm() : ""}
          <button type="submit" className="button button--primary">Submit</button>
        </Formsy.Form>
        </div>
      </CanCreatePost>
    )
  }
});

module.exports = PostNew;
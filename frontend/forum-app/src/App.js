import React, { Component } from 'react';
    import 'semantic-ui-css/semantic.min.css';
    import { Grid, Header, Container } from 'semantic-ui-react';
    import { ArticleList } from './ArticleList';
    import { Article } from './Article';
    import { NewArticle } from './NewArticle';
    class App extends Component {
      state = {
        currentArticle: undefined
      };
      _newArticle = this._handleNewArticle.bind(this);
      _showArticle = this._handleShowArticle.bind(this);
      _handleShowArticle(article) {
        this.setState({
          currentArticle: article
        });
      }
      _handleNewArticle() {
        this.setState({
          currentArticle: undefined
        });
      }
      render() {
        let body;
        if (this.state.currentArticle) {
          body = <Article id={this.state.currentArticle} />
        } else {
          body = <NewArticle />;
        }
        return (
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h2">
                    Google function Blog
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={12}>
                  { body }
                </Grid.Column>
                <Grid.Column width={4}>
                  <ArticleList showArticle={this._showArticle} newArticle={this._newArticle} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        );
      }
    }
    export default App;
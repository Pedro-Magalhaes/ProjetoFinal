import React from 'react';
    import { List } from 'semantic-ui-react';
    import axios from 'axios';
    export class ArticleList extends React.Component {
        state = {
            articles: []
        };
        _showArticle = this._handleShowArticle.bind(this);
        loadList() {
            axios.get('https://us-central1-kubernetes-tecgraf.cloudfunctions.net/forum-test_list-articles')
                .then((response) => {
                    this.setState({
                        articles: response.data
                    });
                });
        }
        _handleShowArticle(article) {
            this.props.showArticle(article.id);
        }
        componentDidMount() {
            this.loadList();
        }
        render() {
            const articleEntries = this.state.articles.map((article) => {
                return (
                    <List.Item key={article.id} onClick={() => this._showArticle(article)}>
                        <List.Content>
                            <List.Header as='a'>{article.title}</List.Header>
                            <List.Description as='a'>{article.created}</List.Description>
                        </List.Content>
                    </List.Item>
                );
            });
            return (
                <List divided relaxed>
                    {articleEntries}
                    <List.Item onClick={this.props.newArticle}>
                        <List.Content>
                            <List.Header as='a'>New Article</List.Header>
                        </List.Content>
                    </List.Item>
                </List>
            );
        }
    }
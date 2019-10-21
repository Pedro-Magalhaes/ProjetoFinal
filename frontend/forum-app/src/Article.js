import React from 'react';
    import { Card, Loader } from 'semantic-ui-react';
    import axios from 'axios';
    export class Article extends React.Component {
        state = {
            article: undefined
        };
        componentDidMount() {
            const id = this.props.id;
            axios.get(`https://us-central1-kubernetes-tecgraf.cloudfunctions.net/forum-test_get-article/${id}`)
                .then((response) => {
                    this.setState({
                        article: response.data
                    });
                });
        }
        render() {
            const { article } = this.state;
            if (!article) {
                return <Loader />;
            }
            return (
                <Card fluid>
                    <Card.Content header={article.title} />
                    <Card.Content description={article.body} />
                    <Card.Content extra>
                        {article.created}
                    </Card.Content>
                </Card>
            );
        }
    }
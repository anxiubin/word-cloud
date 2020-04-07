import React, {useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
});

const databaseURL = "https://word-cloud-9dde8.firebaseio.com";

function Words({classes}) {
    const [state, setState] = useState({
        words: {},
        dialog: false,
        word: '',
        weight: '',
    });

    // const {words, dialog, word, weight} = state;

    const getWords = () => {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then( words => setState({...state, words: words}));
    }

    const postWords = word => {
        return fetch(`${databaseURL}/words.json`, {
            method: 'POST',
            body: JSON.stringify(word)
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = state.words;
            nextState[data.name] = word;
            setState({...state, 
                words: nextState,
                dialog: false,
                word: '',
                weight: '',});
        })
    }

    const deleteWords = id => {
        return fetch(`${databaseURL}/words/${id}.json`, {
            method: 'DELETE',
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = state.words;
            delete nextState[id];
            setState({...state, words: nextState});
        })
    }

    const handleDialogToggle = () => {
        setState({...state, dialog: !state.dialog});
    }

    const handleValueChange = e => {
        setState({...state,
        [e.target.name] : e.target.value});
    }

    const handleSubmit = e => {
        const word = {
            word: state.word,
            weight: state.weight
        };
        if(!word.word && !word.weight) {
            return;
        }
        postWords(word);
    }

    const handleDelete = id => {
        deleteWords(id);
    }

    useEffect(() => {
        getWords();
    },[])

    return (
        <>
            {Object.keys(state.words).map(id => {
                const wordEl = state.words[id];
                return (
                    <div key={id}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    가중치: {wordEl.weight}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component="h2">
                                        {wordEl.word}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="contained" color="primary" onClick={() => handleDelete(id)}>삭제</Button>
                                    </Grid>
                                </Grid>                                
                            </CardContent>
                        </Card>
                        <Fab color="primary" className={classes.fab} onClick={handleDialogToggle}>
                            <AddIcon/>
                        </Fab>
                        <Dialog open={state.dialog} onClose={handleDialogToggle}>
                            <DialogTitle>단어 추가</DialogTitle>
                            <DialogContent>
                                <TextField 
                                    label="단어" 
                                    type="text" 
                                    name="word" 
                                    value={state.word} 
                                    onChange={handleValueChange}>
                                </TextField> <br/>
                                <TextField 
                                    label="가중치" 
                                    type="text" 
                                    name="weight" 
                                    value={state.weight} 
                                    onChange={handleValueChange}>
                                </TextField> <br/>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>추가</Button>
                                <Button variant="outlined" color="primary" onClick={handleDialogToggle}>닫기</Button>
                            </DialogActions>                            
                        </Dialog>
                    </div>                    
                )
            })}            
        </>
        
    );
}

export default withStyles(styles)(Words);
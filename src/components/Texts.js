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
import TextTruncate from 'react-text-truncate';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const styles = theme => ({
    hidden: {
        display: 'none'
    },
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
});

const databaseURL = "https://word-cloud-9dde8.firebaseio.com";

function Texts({classes}) {
    const [state, setState] = useState({
        fileName: '',
        fileContent: null,
        texts: {},
        textName: '',
        dialog: false,
    });

    const getTexts = () => {
        fetch(`${databaseURL}/texts.json`).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then( texts => setState({...state, texts: (texts === null) ? {} : texts}));
    }

    const postTexts = text => {
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = state.texts;
            nextState[data.name] = text;

            setState({...state, 
                texts: nextState,
                dialog: false});
        })
    };

    const deleteTexts = id => {
        return fetch(`${databaseURL}/texts/${id}.json`, {
            method: 'DELETE',
        }).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = state.texts;
            delete nextState[id];
            setState({...state, texts: nextState});
        })
    }

    const handleDialogToggle = () => {
        setState({...state, 
            fileName: '',
            fileContent: null,
            textName: '',
            dialog: !state.dialog});
    }

    const handleValueChange = e => {
        setState({...state,
        [e.target.name] : e.target.value});
    }

    const handleSubmit = e => {
        const text = {
            textName: state.textName,
            textContent: state.fileContent
        };
        if(!text.textName && !text.textContent) {
            return;
        }
        postTexts(text);
    }

    const handleDelete = id => {
        deleteTexts(id);
    }

    const handleFileChange = e => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            setState(state => {
                return {...state, fileContent: text}
            });
        }
        reader.readAsText(e.target.files[0], "UTF-8");
        setState(state => {
            return {...state, fileName: e.target.value}
        });
    }

    useEffect(() => {
        getTexts();
    },[]);


    return (
        <>
            {Object.keys(state.texts).map(id => {
                const text = state.texts[id];
                return (
                    <Card key={id}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                내용: {text.textContent.substring(0, 24) + "..."}
                            </Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="h5" component="h2">
                                        {text.textName.substring(0, 14) + "..."}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Link component={RouterLink} to={"detail/"+id}>
                                        <Button variant="contained" color="primary">보기</Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" onClick={() => handleDelete(id)}>삭제</Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )
            })}
            <Fab color="primary" className={classes.fab} onClick={handleDialogToggle}>
                <AddIcon/>
            </Fab>
            <Dialog open={state.dialog} onClose={handleDialogToggle}>
                <DialogTitle>텍스트 추가</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="텍스트 이름" 
                        type="text" 
                        name="textName" 
                        value={state.textName} 
                        onChange={handleValueChange}>                        
                    </TextField> <br/>
                    <input 
                        className={classes.hidden} 
                        accept="text/plain" 
                        id="raised-button-file" 
                        type="file" 
                        file={state.file} 
                        value={state.fileName} 
                        onChange={handleFileChange}>
                    </input> <br/>
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" color="primary" component="span" name="file">
                            {state.fileName === "" ? ".txt 파일 선택" : state.fileName}
                        </Button>
                    </label>
                    <TextTruncate line={1} truncateText="..." text={state.fileContent}></TextTruncate>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>추가</Button>
                    <Button variant="outlined" color="primary" onClick={handleDialogToggle}>닫기</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default withStyles(styles)(Texts);
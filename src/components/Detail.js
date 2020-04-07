import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function Detail({match}) {
    return (
        <Card>
            <CardContent>
                {match.params.textID}
            </CardContent>
        </Card>
    );
}

export default Detail;
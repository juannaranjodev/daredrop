/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable import/no-named-as-default */
import React, { memo } from 'react'
import { map, prop, addIndex } from 'ramda'
import { orNull } from 'root/src/shared/util/ramdaPlus'
import AutoCompleteEmbedded from 'root/src/client/web/embedded/embeddedModules/AutoCompleteEmbedded'
import DropdownEmbedded from 'root/src/client/web/embedded/embeddedModules/DropdownEmbedded'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    fields: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        '@media(max-width: 800px)': {
            paddingTop: 25,
        },
        '@media(max-width: 631px)': {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            justifyItems: 'center',
        },
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    item: {
        dispaly: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        '@media(max-width: 321px)': {
            alignSelf: 'center',
        },
        '@media(min-width: 632px)': {
            marginLeft: 10,
        },
    },
}

const EmbeddedFieldUnstyled = memo(({ fields, classes, ...moduleProps }) => (
    <div className={classes.fields}>
        <div />
        {orNull(fields, addIndex(map)(({ inputType, ...embedProps }, idx) => {
            switch (inputType) {
                case 'autoCompleteEmbedded':
                    return (
                        <div
                            key={prop('fieldId', embedProps)}
                            className={classes.item}
                        >
                            {orNull(prop('fieldCaption', embedProps),
                                <div className={classes.label}>{prop('fieldCaption', embedProps)}</div>)}
                            <AutoCompleteEmbedded
                                {...moduleProps}
                                fieldId={prop('fieldId', embedProps)}
                                fieldIndex={idx}
                            />
                        </div>
                    )
                case 'dropdownEmbedded':
                    return (
                        <div
                            key={prop('fieldId', embedProps)}
                            className={classes.item}
                        >
                            {orNull(prop('fieldCaption', embedProps),
                                <div className={classes.label}>{prop('fieldCaption', embedProps)}</div>)}
                            <DropdownEmbedded
                                {...moduleProps}
                                fieldId={prop('fieldId', embedProps)}
                                fieldIndex={idx}
                            />
                        </div>
                    )
                default:
            }
        }, fields))}
    </div>
))

export default withStyles(styles)(EmbeddedFieldUnstyled)

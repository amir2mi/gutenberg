/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToolbarDropdownMenu } from '@wordpress/components';

/**
 * Internal dependencies
 */
import HeadingLevelIcon from './heading-level-icon';

const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * @typedef WPHeadingLevelControlOptions
 *
 * @property {boolean} [addParagraphLevel=false] Append paragraph option with zero level to the available levels.
 */

/**
 * HeadingLevelControl props.
 *
 * @typedef WPHeadingLevelControlProps
 *
 * @property {number} value The chosen heading level.
 * @property {(newValue:number)=>any} onChange Callback to run when toolbar value is changed.
 * @property {WPHeadingLevelControlOptions} options Additional options passed to the component.
 */

/**
 * The `HeadingLevelControl` component renders a dropdown menu that displays
 * heading level options for the selected block. This component is used to set
 * the level of the heading in a block and also allows to use a `paragraph`
 * element by setting the level to zero (`0`). The block's `edit` function
 * would also need to handle the zero value. An example of this would be
 * `const TagName = level === 0 ? 'p' : `h${ level }`;`
 *
 * @param {WPHeadingLevelControlProps} props Component props.
 * @return {WPComponent} The Heading Level Control Dropdown.
 */
export default function HeadingLevelControl( {
	value,
	onChange,
	options: { addParagraphLevel = false } = {},
} ) {
	const levels = ! addParagraphLevel
		? HEADING_LEVELS
		: [ ...HEADING_LEVELS, 0 ];
	const allControls = levels.map( ( currentLevel ) => {
		const isActive = currentLevel === value;
		return {
			icon: (
				<HeadingLevelIcon
					level={ currentLevel }
					isPressed={ isActive }
				/>
			),
			title:
				currentLevel === 0
					? __( 'Paragraph' )
					: // translators: %s: heading level e.g: "1", "2", "3"
					  sprintf( __( 'Heading %d' ), currentLevel ),
			isActive,
			onClick() {
				onChange( currentLevel );
			},
		};
	} );

	return (
		<ToolbarDropdownMenu
			icon={ <HeadingLevelIcon level={ value } /> }
			controls={ allControls }
			label={ __( 'Change heading level' ) }
		/>
	);
}

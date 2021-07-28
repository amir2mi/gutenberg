/**
 * External dependencies
 */
import colorize from 'tinycolor2';

/**
 * WordPress dependencies
 */
import { useCopyToClipboard } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Text } from '../../text';
import { Flex, FlexItem } from '../../flex';
import { Tooltip } from '../tooltip';
import type { ColorType } from './types';
import { space } from '../utils/space';

interface ColorDisplayProps {
	color: string;
	colorType: ColorType;
	disableAlpha: boolean;
}

interface DisplayProps {
	color: string;
	disableAlpha: boolean;
}

type Values = [ number, string ][];

interface ValueDisplayProps {
	values: Values;
}

const ValueDisplay = ( { values }: ValueDisplayProps ) => (
	<>
		{ values.map( ( [ value, abbreviation ] ) => {
			return (
				<FlexItem key={ abbreviation } isBlock display="flex">
					<Text color="blue">{ abbreviation }</Text>
					<div>{ value }</div>
				</FlexItem>
			);
		} ) }
	</>
);

const HslDisplay = ( { color, disableAlpha }: DisplayProps ) => {
	const { h, s, l, a } = colorize( color ).toHsl();

	const values: Values = [
		[ Math.floor( h ), 'H' ],
		[ Math.round( s * 100 ), 'S' ],
		[ Math.round( l * 100 ), 'L' ],
	];
	if ( ! disableAlpha ) {
		values.push( [ Math.round( a * 100 ), 'A' ] );
	}

	return <ValueDisplay values={ values } />;
};

const RgbDisplay = ( { color, disableAlpha }: DisplayProps ) => {
	const { r, g, b, a } = colorize( color ).toRgb();

	const values: Values = [
		[ r, 'R' ],
		[ g, 'G' ],
		[ b, 'B' ],
	];

	if ( ! disableAlpha ) {
		values.push( [ Math.round( a * 100 ), 'A' ] );
	}

	return <ValueDisplay values={ values } />;
};

const HexDisplay = ( { color }: DisplayProps ) => {
	const colorWithoutHash = color.slice( 1 );
	return (
		<>
			<Text>{ colorWithoutHash }</Text>
			<Text color="blue">#</Text>
		</>
	);
};

const getComponent = ( colorType: ColorType ) => {
	switch ( colorType ) {
		case 'hsl':
			return HslDisplay;
		case 'rgb':
			return RgbDisplay;
		default:
		case 'hex':
			return HexDisplay;
	}
};

export const ColorDisplay = ( {
	color,
	colorType,
	disableAlpha,
}: ColorDisplayProps ) => {
	const [ copiedColor, setCopiedColor ] = useState< string | null >( null );
	const props = { color, disableAlpha };
	const Component = getComponent( colorType );
	const copyRef = useCopyToClipboard< HTMLDivElement >( color, () =>
		setCopiedColor( color )
	);
	return (
		<Tooltip
			content={
				<Text color="white">
					{ copiedColor === color ? __( 'Copied!' ) : __( 'Copy' ) }
				</Text>
			}
		>
			<Flex justify="flex-start" gap={ space( 1 ) } ref={ copyRef }>
				<Component { ...props } />
			</Flex>
		</Tooltip>
	);
};

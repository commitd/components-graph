import { Caption, Column, Heading, Row } from '@committed/ds'
import React from 'react'

interface EmptyStateProps {
  message?: React.ReactNode
  help?: string
  size?: 'small' | 'default'
  logo?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No results found',
  size = 'default',
  help,
  logo,
}) => {
  return (
    <Row css={{ justifyContent: 'center', width: '100%', padding: '$5' }}>
      <Column css={{ alignItems: 'center' }}>
        {logo == null ? (
          <img
            src={logo}
            alt=""
            style={{
              filter: 'grayscale(75%) opacity(75%)',
              width: size === 'small' ? 100 : undefined,
            }}
          />
        ) : null}
        <Heading variant="h5" size={'$1'} css={{ mt: '$3' }}>
          {message}
        </Heading>
        {help == null ? <Caption css={{ mt: '$2' }}>{help}</Caption> : null}
      </Column>
    </Row>
  )
}

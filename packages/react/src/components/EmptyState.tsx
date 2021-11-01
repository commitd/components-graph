import { Caption, Flex, Heading } from '@committed/components'
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
    <Flex css={{ justifyContent: 'center', width: '100%', padding: '$5' }}>
      <Flex css={{ flexDirection: 'column', alignItems: 'center' }}>
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
        <Heading variant="h5" size={1} css={{ mt: '$3' }}>
          {message}
        </Heading>
        {help == null ? <Caption css={{ mt: '$2' }}>{help}</Caption> : null}
      </Flex>
    </Flex>
  )
}

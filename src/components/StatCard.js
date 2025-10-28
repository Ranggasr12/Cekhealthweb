import { Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, Flex, Box, Icon } from '@chakra-ui/react'

export default function StatCard({ title, value, description, icon, color = 'blue.500', ...rest }) {
  return (
    <Card {...rest}>
      <CardBody>
        <Stat>
          <Flex align="center" justify="space-between">
            <Box>
              <StatLabel>{title}</StatLabel>
              <StatNumber>{value}</StatNumber>
              <StatHelpText>{description}</StatHelpText>
            </Box>
            <Icon as={icon} boxSize={8} color={color} />
          </Flex>
        </Stat>
      </CardBody>
    </Card>
  )
}
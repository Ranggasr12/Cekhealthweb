import {
  Box,
  Spinner,
  Text,
  VStack,
  Flex,
  Progress,
  keyframes
} from '@chakra-ui/react'

// Keyframes untuk pulse animation
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`

// Loading Spinner dasar
export const LoadingSpinner = ({ 
  size = 'xl', 
  color = 'blue.500',
  thickness = '4px',
  ...props 
}) => {
  return (
    <Flex justify="center" align="center" p={8}>
      <Spinner
        size={size}
        color={color}
        thickness={thickness}
        speed="0.65s"
        emptyColor="gray.200"
        {...props}
      />
    </Flex>
  )
}

// Loading dengan text
export const LoadingWithText = ({ 
  text = 'Loading...',
  size = 'xl',
  color = 'blue.500',
  textColor = 'gray.600'
}) => {
  return (
    <VStack spacing={4} p={8}>
      <Spinner
        size={size}
        color={color}
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
      />
      <Text color={textColor} fontSize="lg">
        {text}
      </Text>
    </VStack>
  )
}

// Loading untuk halaman full
export const PageLoader = ({ 
  text = 'Memuat...',
  showProgress = false,
  progressValue = 0 
}) => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="white"
      zIndex="modal"
      justify="center"
      align="center"
      flexDirection="column"
      gap={6}
    >
      <VStack spacing={4}>
        <Spinner
          size="xl"
          color="blue.500"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
        />
        <Text fontSize="lg" color="gray.600" fontWeight="medium">
          {text}
        </Text>
      </VStack>
      
      {showProgress && (
        <Box w="300px">
          <Progress 
            value={progressValue} 
            size="sm" 
            colorScheme="blue" 
            borderRadius="full"
          />
          <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
            {progressValue}%
          </Text>
        </Box>
      )}
    </Flex>
  )
}

// Skeleton loading untuk cards
export const SkeletonLoader = ({ count = 3, height = '100px' }) => {
  const pulseAnimation = `${pulse} 2s infinite`

  return (
    <VStack spacing={4} align="stretch">
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          height={height}
          bg="gray.100"
          borderRadius="md"
          animation={pulseAnimation}
        />
      ))}
    </VStack>
  )
}

// Loading untuk table rows
export const TableRowLoader = ({ columns = 4, rows = 5 }) => {
  const pulseAnimation = `${pulse} 2s infinite`

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <Box
                height="20px"
                bg="gray.100"
                borderRadius="sm"
                animation={pulseAnimation}
                m={1}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// Loading untuk button
export const ButtonLoader = ({ size = 'md' }) => {
  return (
    <Spinner
      size={size}
      color="currentColor"
      thickness="2px"
      speed="0.65s"
      emptyColor="transparent"
    />
  )
}

// Export default component
export default LoadingSpinner
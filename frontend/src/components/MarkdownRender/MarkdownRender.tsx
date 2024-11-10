import ReactMarkdown from 'react-markdown'

const MarkdownRender = ({ props }) => {
  return (
    <ReactMarkdown>
    {props}
    </ReactMarkdown>
  )
}

export default MarkdownRender

import React from 'react'
import useProjects from '../customehookapi/useProjects';
import { Card, List, Spin, Empty } from 'antd';

function Singleproject({selectedProjectId}) {

    const { Showproject, loading, error, refetchProjects } = useProjects(selectedProjectId);
    const project=Showproject?.data
    const users=Showproject?.data?.users
console.log(users)


  if (loading) return <Spin size="large" />;
  if (error) return <p>{error}</p>;
  return (
<>
<div style={{ padding: '20px' }}>
      {/* Use Card for a better layout */}
      <Card
        title={<h2>{`Project Name: ${project?.name} (ID: ${project?.id})`}</h2>}
        bordered={false}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {/* Check if there are users assigned to the project */}
        {users && users.length > 0 ? (
          <List
            header={<strong>Assigned Users</strong>}
            bordered
            dataSource={users}
            renderItem={user => (
              <List.Item key={user.id}>
                {user.name} - {user.role || 'No role specified'}
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No users assigned to this project" />
        )}
      </Card>
    </div>
</>
  )
}

export default Singleproject
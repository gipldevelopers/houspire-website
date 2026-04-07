import { appDataClient } from '@/lib/static-client';
/**
 * Get digest data for user
 */
export async function getDigestData(userId, period) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        if (period === 'daily') {
            startDate.setDate(startDate.getDate() - 1);
        }
        else {
            startDate.setDate(startDate.getDate() - 7);
        }
        // Get user profile
        const { data: profile } = await appDataClient
            .from('profiles')
            .select('full_name')
            .eq('user_id', userId)
            .maybeSingle();
        if (!profile)
            return null;
        // Get new messages count
        const { count: messagesCount } = await appDataClient
            .from('chat_messages')
            .select('id', { count: 'exact', head: true })
            .neq('sender_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        // Get projects for this user
        const { data: userProjects } = await appDataClient
            .from('projects')
            .select('id')
            .eq('user_id', userId);
        const projectIds = userProjects?.map(p => p.id) || [];
        // Get design updates (concepts)
        let designsCount = 0;
        if (projectIds.length > 0) {
            const { count } = await appDataClient
                .from('concepts')
                .select('id', { count: 'exact', head: true })
                .in('project_id', projectIds)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());
            designsCount = count || 0;
        }
        // Get order updates
        const { data: orders } = await appDataClient
            .from('orders')
            .select('id, order_number, status, updated_at')
            .eq('user_id', userId)
            .gte('updated_at', startDate.toISOString())
            .lte('updated_at', endDate.toISOString());
        // Build highlights
        const highlights = [];
        if (designsCount > 0) {
            highlights.push({
                type: 'design',
                title: `${designsCount} New Design${designsCount > 1 ? 's' : ''} Ready`,
                description: 'Your designer uploaded new concept designs',
                link: '/dashboard',
                timestamp: endDate.toISOString()
            });
        }
        orders?.forEach(order => {
            highlights.push({
                type: 'order',
                title: `Order #${order.order_number} Updated`,
                description: `Status: ${order.status.replace(/_/g, ' ')}`,
                link: `/dashboard/orders/${order.id}`,
                timestamp: order.updated_at
            });
        });
        const stats = {
            newMessages: messagesCount || 0,
            designUpdates: designsCount,
            orderUpdates: orders?.length || 0,
            pendingActions: 0 // Could be calculated from quick actions
        };
        // Don't send if no activity
        if (Object.values(stats).every(v => v === 0)) {
            return null;
        }
        return {
            userId,
            userName: profile.full_name || 'there',
            email: '', // Email comes from auth.users, not profiles
            period,
            startDate,
            endDate,
            stats,
            highlights: highlights.slice(0, 5)
        };
    }
    catch (error) {
        console.error('Error getting digest data:', error);
        return null;
    }
}
/**
 * Generate HTML email template for digest
 */
export function generateDigestHTML(data) {
    const periodLabel = data.period === 'daily' ? 'Daily' : 'Weekly';
    const periodText = data.period === 'daily' ? 'yesterday' : 'this week';
    const highlightsHTML = data.highlights.length > 0
        ? `
      <div style="margin-top: 24px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1a1a1a;">📌 Highlights</h3>
        ${data.highlights.map(h => `
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-bottom: 12px;">
            <p style="font-weight: 600; margin: 0 0 4px 0; color: #1a1a1a;">${h.title}</p>
            <p style="color: #666; margin: 0; font-size: 14px;">${h.description}</p>
          </div>
        `).join('')}
      </div>
    `
        : '';
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${periodLabel} Houspire Digest</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Houspire</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Your ${periodLabel} Digest</p>
    </div>

    <!-- Greeting -->
    <div style="padding: 32px;">
      <p style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0;">Hi ${data.userName}! 👋</p>
      <p style="color: #666; margin: 0;">Here's what happened ${periodText} with your Houspire projects:</p>
    </div>

    <!-- Stats Grid -->
    <div style="padding: 0 32px 32px;">
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #0ea5e9;">${data.stats.designUpdates}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Design Updates</div>
        </div>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #22c55e;">${data.stats.newMessages}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">New Messages</div>
        </div>
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">${data.stats.orderUpdates}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Order Updates</div>
        </div>
        <div style="background: #fce7f3; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #ec4899;">${data.stats.pendingActions}</div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Pending Actions</div>
        </div>
      </div>
    </div>

    <!-- Highlights -->
    <div style="padding: 0 32px 32px;">
      ${highlightsHTML}
    </div>

    <!-- CTA -->
    <div style="padding: 0 32px 32px; text-align: center;">
      <a href="https://houspire.ai/dashboard" style="display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #999; margin: 0 0 8px 0;">
        You're receiving this ${data.period} digest because you opted in to Houspire notifications.
      </p>
      <p style="font-size: 12px; color: #999; margin: 0;">
        <a href="https://houspire.ai/settings" style="color: #666;">Update preferences</a>
        &nbsp;|&nbsp;
        <a href="https://houspire.ai/settings?unsubscribe=digest" style="color: #666;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
}


class Ability
  include CanCan::Ability

  def initialize user
    user ||= User.new
    can :show, User, id: user.id
    can :manage, Calendar
    can :manage, Event
    can :manage, Attendee
    can :show, Event
    can :read, Organization
    can :manage, Organization, owner_id: user.id
    can :manage, UserOrganization
  end
end

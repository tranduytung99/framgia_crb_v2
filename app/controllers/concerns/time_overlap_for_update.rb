module TimeOverlapForUpdate
  private
  def overlap_when_update? event
    event_overlap = OverlapHandler.new(event)
    event_overlap.overlap?
  end
end

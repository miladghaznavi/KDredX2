import griffon.util.AbstractMapResourceBundle;

import javax.annotation.Nonnull;
import java.util.Map;

import static java.util.Arrays.asList;
import static griffon.util.CollectionUtils.map;

public class Config extends AbstractMapResourceBundle {
    private final static String TITLE = "Multi Tech Vis";

    @Override
    protected void initialize(@Nonnull Map<String, Object> entries) {
        map(entries)
            .e("application", map()
                .e("title", TITLE)
                .e("startupGroups", asList("multiTechVis"))
                .e("autoShutdown", true)
            )
            .e("mvcGroups", map()
                .e("multiTechVis", map()
                    .e("model", "org.mtv.MultiTechVisModel")
                    .e("view", "org.mtv.MultiTechVisView")
                    .e("controller", "org.mtv.MultiTechVisController")
                )
                .e("data", map()
                    .e("model", "org.mtv.DataModel")
                    .e("view", "org.mtv.DataView")
                    .e("controller", "org.mtv.DataController")
                )
                .e("chart", map()
                    .e("model", "org.mtv.ChartModel")
                    .e("view", "org.mtv.ChartView")
                    .e("controller", "org.mtv.ChartController")
                )
            );
    }
}